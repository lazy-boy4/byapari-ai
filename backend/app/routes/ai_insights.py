from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.insight_engine import generate_insights
from app.services.forecast import generate_sales_forecast
from app.services.gemini_service import generate_ai_analysis
import traceback
import pandas as pd

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
        df = pd.DataFrame(request.csv_data)
        forecast = generate_sales_forecast(df)
        result["forecast"] = forecast
        
        ai_text = generate_ai_analysis(
            kpis=result.get("kpis", {}),
            insights=result.get("insights", []),
            lang=request.lang
        )
        
        result["ai_summary"] = ai_text

        return result

    except Exception as e:

        print("AI INSIGHTS ERROR:")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )