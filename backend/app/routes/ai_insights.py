from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.insight_engine import generate_insights

router = APIRouter()


class InsightRequest(BaseModel):
    csv_data: list[dict]
    lang: str = "en"


@router.post("/api/ai-insights")
async def get_ai_insights(request: InsightRequest):

    if not request.csv_data:
        raise HTTPException(
            status_code=400,
            detail="csv_data is required"
        )

    try:

        result = generate_insights(
            request.csv_data,
            request.lang
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )