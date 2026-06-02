from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.insight_engine import generate_insights
from app.services.forecast import generate_sales_forecast
from app.services.gemini_service import generate_ai_analysis
from app.services.rag_service import knowledge_base
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
        print(f"🔥 DEBUG: lang received = {request.lang}")
        
        # Generate base insights
        result = generate_insights(
            request.csv_data,
            request.lang
        )
        df = pd.DataFrame(request.csv_data)
        
        # Generate forecast
        forecast = generate_sales_forecast(df)
        result["forecast"] = forecast
        
        # === RAG ENHANCEMENT ===
        # Build context from business data for RAG query
        top_category = result.get("top_performer", {}).get("product", "general")
        health_score = result.get("health_score", 50)
        insights_list = result.get("insights", [])
        
        # Create rich context for RAG based on business situation
        rag_context_parts = [top_category]
        
        if health_score < 50:
            rag_context_parts.append("urgent action needed low performance")
        elif health_score < 70:
            rag_context_parts.append("improvement needed")
        
        # Add context from insight types
        insight_types = [i["type"] for i in insights_list]
        if "inventory" in insight_types or "risk" in insight_types:
            rag_context_parts.append("inventory stock management")
        if "warning" in insight_types:
            rag_context_parts.append("sales decline pricing strategy")
        if "growth" in insight_types:
            rag_context_parts.append("growth scaling expansion")
        
        rag_context = " ".join(rag_context_parts)
        print(f"🔥 RAG Context: {rag_context}")
        
        # Retrieve relevant tips
        rag_tips = knowledge_base.query(rag_context, n_results=3)
        result["rag_recommendations"] = rag_tips
        print(f"🔥 RAG Retrieved: {len(rag_tips)} tips")
        
        # Build RAG text for AI prompt
        rag_text = "\n".join([f"- {tip['text']}" for tip in rag_tips])
        
        # Generate AI analysis with RAG context
        ai_text = generate_ai_analysis(
            kpis=result.get("kpis", {}),
            insights=insights_list,
            lang=request.lang,
            rag_context=rag_text
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