from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.pricing_engine import generate_pricing_suggestions, get_pricing_summary
import pandas as pd
import numpy as np
import traceback

router = APIRouter()


class PricingRequest(BaseModel):
    csv_data: list[dict]
    lang: str = "en"


def _json_safe(obj):
    """Recursively convert numpy scalars and non-finite floats to plain Python."""
    if isinstance(obj, dict):
        return {k: _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_json_safe(v) for v in obj]
    # Catch any numpy scalar via .item() — covers int64, float64, bool_, str_, etc.
    if hasattr(obj, "item") and hasattr(obj, "dtype"):
        v = obj.item()
        if isinstance(v, float) and (v != v or abs(v) == float("inf")):
            return None
        return v
    if isinstance(obj, float) and (obj != obj or abs(obj) == float("inf")):
        return None
    return obj


@router.post("/api/pricing-suggestions")
async def get_pricing_suggestions(request: PricingRequest):
    if not request.csv_data:
        raise HTTPException(status_code=400, detail="csv_data is required")

    try:
        df = pd.DataFrame(request.csv_data)
        suggestions, stable_count, total_products = generate_pricing_suggestions(df)
        summary = get_pricing_summary(suggestions, stable_count, total_products, request.lang)

        for s in suggestions:
            s["display_text"] = s.get(
                "action_text_bn" if request.lang == "bn" else "action_text",
                s["action_text"],
            )

        return _json_safe({
            "suggestions": suggestions,
            "summary": summary,
            "generated_at": pd.Timestamp.now().isoformat(),
        })

    except Exception as e:
        print("PRICING ERROR:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
