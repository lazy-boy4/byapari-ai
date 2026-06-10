"""End-to-end test of the /api/ai-insights pipeline (incl. live LLM call)."""

import asyncio
import sys

from dotenv import load_dotenv

load_dotenv()

from test_new_services import rows  # noqa: E402
from app.routes.ai_insights import get_ai_insights, InsightRequest  # noqa: E402

lang = sys.argv[1] if len(sys.argv) > 1 else "en"
result = asyncio.run(get_ai_insights(InsightRequest(csv_data=rows, lang=lang)))
print("keys:", sorted(result.keys()))
print("insights count:", len(result["insights"]))
print("graph recs merged:", len(result["graph_insights"]["recommendations"]))
print("profile tier:", result["merchant_profile"]["scale_tier"])
print("fx available:", result["market_signals"]["exchange_rate"]["available"])
print("forecast points:", len(result.get("forecast", [])))
print("--- AI SUMMARY (first 700 chars) ---")
print((result.get("ai_summary") or "")[:700])
