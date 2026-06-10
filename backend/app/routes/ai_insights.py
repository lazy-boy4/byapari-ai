from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.insight_engine import generate_insights
from app.services.forecast import generate_sales_forecast
from app.services.gemini_service import generate_ai_analysis
from app.services.rag_service import knowledge_base
from app.services.graph_service import build_graph_insights
from app.services.market_service import get_market_signals, build_market_context
from app.services.personalization import build_merchant_profile
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

        # Retrieve relevant tips
        rag_tips = knowledge_base.query(rag_context, n_results=3)
        result["rag_recommendations"] = rag_tips

        # Build RAG text for AI prompt
        rag_text = "\n".join([f"- {tip['text']}" for tip in rag_tips])

        # === KNOWLEDGE GRAPH REASONING ===
        graph_insights = build_graph_insights(df, lang=request.lang)
        result["graph_insights"] = graph_insights
        # Surface graph-derived recommendations alongside the rule-based ones
        result["insights"] = insights_list + graph_insights["recommendations"]
        graph_facts_text = "\n".join(f"- {fact}" for fact in graph_insights["facts"][:6])

        # === MERCHANT PERSONALIZATION PROFILE ===
        profile = build_merchant_profile(df, lang=request.lang)
        result["merchant_profile"] = profile

        # === LIVE MARKET SIGNALS (scraped/parsed real-world data) ===
        market_signals = get_market_signals()
        result["market_signals"] = market_signals
        top_category = ""
        if "product_category" in df.columns and len(df) > 0:
            top_category = str(df["product_category"].mode()[0])
        market_context_text = build_market_context(market_signals, top_category)

        # Generate AI analysis grounded in RAG + graph + profile + market
        ai_text = generate_ai_analysis(
            kpis=result.get("kpis", {}),
            insights=insights_list,
            lang=request.lang,
            rag_context=rag_text,
            graph_facts=graph_facts_text,
            market_context=market_context_text,
            profile_summary=profile.get("summary", ""),
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