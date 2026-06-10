"""MongoDB connection helper.

Provides a lazily-initialised singleton client so the rest of the app can
grab the analysis-history collection without each module re-reading env vars
or re-opening sockets. Connection failures surface as exceptions to the
caller, which decides whether to degrade gracefully (the upload endpoint
never fails just because history couldn't be saved) or to error (the history
endpoints return 503).
"""
from __future__ import annotations

import os

from pymongo import ASCENDING, DESCENDING, MongoClient

# Database / collection names live here so callers don't hard-code strings.
# The connection string has no default database, so we name it explicitly.
DB_NAME = "byapari_ai"
HISTORY_COLLECTION = "analysis_history"

_client = None
_indexes_ready = False


def _build_client() -> MongoClient:
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise RuntimeError(
            "MONGODB_URI is not set. Add it to backend/.env to enable analysis history."
        )
    # serverSelectionTimeoutMS keeps a dead/unreachable DB from hanging
    # requests indefinitely — fail fast instead.
    return MongoClient(uri, serverSelectionTimeoutMS=5000, appname="byapari-ai")


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = _build_client()
    return _client


def get_history_collection():
    """Return the analysis-history collection, ensuring its index exists once
    per process."""
    global _indexes_ready
    col = get_client()[DB_NAME][HISTORY_COLLECTION]
    if not _indexes_ready:
        try:
            # One compound index covers the only query we run: a user's
            # analyses, newest first.
            col.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
            _indexes_ready = True
        except Exception:
            # Index creation is best-effort; queries still work without it.
            pass
    return col
