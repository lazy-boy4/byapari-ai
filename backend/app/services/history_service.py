"""Persistence layer for per-user analysis history (MongoDB).

Each successful CSV analysis is stored as one document keyed by the
authenticated user's id (the Firebase uid sent from the frontend). The
dashboard can then list a user's past analyses and re-open any of them.
Heavy fields (the full result, including every CSV row) are only returned
for single-item reads; the list view returns lightweight summaries.
"""
from __future__ import annotations

import math
from datetime import date, datetime, timezone

import numpy as np
from bson import ObjectId
from bson.errors import InvalidId
from pymongo import DESCENDING

from app.db.mongo import get_history_collection


def _iso(value):
    """Serialise a datetime to ISO-8601 so it survives JSON encoding."""
    if isinstance(value, datetime):
        return value.isoformat()
    return value


def _bson_safe(value):
    """Recursively convert a value into BSON-safe native Python types.

    The analysis result is built with pandas/numpy, so it can contain numpy
    scalars, pandas Timestamps and NaN/NaT — none of which pymongo can encode
    directly. This normalises everything so the document inserts cleanly.
    """
    # numpy scalar (int64 / float64 / bool_) → native Python scalar
    if isinstance(value, np.generic):
        value = value.item()

    if value is None or isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        return None if (math.isnan(value) or math.isinf(value)) else value
    if isinstance(value, datetime):
        # pandas NaT subclasses datetime but is never equal to itself.
        return None if value != value else value
    if isinstance(value, date):
        return datetime(value.year, value.month, value.day)
    if isinstance(value, dict):
        return {str(k): _bson_safe(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set, np.ndarray)):
        return [_bson_safe(v) for v in value]
    # Fallback: anything exotic is stored as its string form rather than
    # failing the whole insert.
    return str(value)


def _summary_from_result(result: dict) -> dict:
    """Pull a few cheap, display-friendly numbers out of a full result so the
    history list never has to ship the whole payload."""
    kpis = result.get("kpis") or {}
    return {
        "total_sales": kpis.get("total_sales", 0),
        "total_profit": kpis.get("total_profit", 0),
        "total_orders": kpis.get("total_orders", 0),
        "top_category": kpis.get("top_category", "N/A"),
        "health_score": result.get("health_score", 0),
    }


def save_analysis(user_id: str, email: str | None, file_name: str, result: dict) -> str:
    """Persist one analysis. Returns the new document id as a string."""
    safe_result = _bson_safe(result)
    doc = {
        "user_id": user_id,
        "email": email,
        "file_name": file_name,
        "created_at": datetime.now(timezone.utc),
        "rows": safe_result.get("rows", 0),
        "summary": _summary_from_result(safe_result),
        "result": safe_result,
    }
    inserted = get_history_collection().insert_one(doc)
    return str(inserted.inserted_id)


def list_history(user_id: str, limit: int = 50) -> list[dict]:
    """Return lightweight summaries of a user's analyses, newest first."""
    cursor = (
        get_history_collection()
        .find({"user_id": user_id}, {"result": 0})
        .sort("created_at", DESCENDING)
        .limit(limit)
    )
    return [
        {
            "id": str(doc["_id"]),
            "file_name": doc.get("file_name", "Untitled"),
            "created_at": _iso(doc.get("created_at")),
            "rows": doc.get("rows", 0),
            "summary": doc.get("summary", {}),
        }
        for doc in cursor
    ]


def get_history(user_id: str, history_id: str) -> dict | None:
    """Return one analysis in the same shape the upload endpoint returns, plus
    history metadata. None if not found or not owned by this user."""
    try:
        oid = ObjectId(history_id)
    except (InvalidId, TypeError):
        return None
    doc = get_history_collection().find_one({"_id": oid, "user_id": user_id})
    if not doc:
        return None
    result = doc.get("result", {}) or {}
    # Spread the stored result and attach metadata so the frontend can treat
    # it exactly like a fresh upload response.
    return {
        **result,
        "history_id": str(doc["_id"]),
        "file_name": doc.get("file_name"),
        "created_at": _iso(doc.get("created_at")),
    }


def delete_history(user_id: str, history_id: str) -> bool:
    """Delete one of the user's analyses. Returns True if a document was
    removed (also guards against deleting another user's record)."""
    try:
        oid = ObjectId(history_id)
    except (InvalidId, TypeError):
        return False
    res = get_history_collection().delete_one({"_id": oid, "user_id": user_id})
    return res.deleted_count > 0
