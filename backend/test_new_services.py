"""Smoke test for graph reasoning, personalization, and market intelligence.

Run:  python test_new_services.py
"""

import json
import random
from datetime import date, timedelta

import pandas as pd

from app.services.graph_service import build_graph_insights
from app.services.personalization import build_merchant_profile
from app.services.market_service import get_market_signals, build_market_context

random.seed(42)

PRODUCTS = [
    ("Cats Eye Jeans", "Fashion"),
    ("Panjabi Premium", "Fashion"),
    ("Bluetooth Earbuds", "Electronics"),
    ("Power Bank 10000mAh", "Electronics"),
    ("Rice Cooker", "Home & Kitchen"),
    ("Blender Pro", "Home & Kitchen"),
]
CITIES = ["Dhaka", "Chattogram", "Khulna", "Sylhet"]
PAYMENTS = ["bKash", "Cash on Delivery", "Bank Transfer", "Nagad"]

rows = []
start = date(2026, 3, 1)
for i in range(120):
    name, cat = random.choice(PRODUCTS)
    rows.append({
        "date": str(start + timedelta(days=random.randint(0, 90))),
        "product_name": name,
        "product_category": cat,
        "sales": random.randint(500, 8000),
        "profit": random.randint(50, 2000),
        "quantity": random.randint(1, 5),
        "rating": round(random.uniform(3.0, 5.0), 1),
        "returned": random.choice(["Yes"] + ["No"] * 7),
        "stock": random.randint(5, 200),
        "payment_method": random.choice(PAYMENTS),
        "customer_city": random.choices(CITIES, weights=[5, 3, 1, 1])[0],
    })

df = pd.DataFrame(rows)

print("=" * 60)
print("1) KNOWLEDGE GRAPH REASONING")
print("=" * 60)
gi = build_graph_insights(df, lang="en")
print("Graph stats:", gi["graph_stats"])
print("Cross-sell pairs:", json.dumps(gi["cross_sell"], indent=2))
print("City opportunities:", json.dumps(gi["city_opportunities"], indent=2))
print("Payment preferences:", json.dumps(gi["payment_preferences"], indent=2))
print("Facts for LLM grounding:")
for fact in gi["facts"]:
    print("  -", fact)
print("Recommendations (en):", len(gi["recommendations"]))
gi_bn = build_graph_insights(df, lang="bn")
print("Recommendations (bn) sample:", gi_bn["recommendations"][0]["message"] if gi_bn["recommendations"] else "none")

print()
print("=" * 60)
print("2) MERCHANT PERSONALIZATION PROFILE")
print("=" * 60)
profile = build_merchant_profile(df, lang="en")
print(json.dumps(profile, indent=2, ensure_ascii=False))

print()
print("=" * 60)
print("3) LIVE MARKET SIGNALS")
print("=" * 60)
signals = get_market_signals()
print("FX:", signals["exchange_rate"])
print("News available:", signals["news"]["available"], "| headlines:", len(signals["news"].get("headlines", [])))
print("Market context for LLM:")
print(build_market_context(signals, "Electronics"))

print()
print("ALL SMOKE TESTS PASSED" if gi["graph_stats"]["nodes"] > 0 and profile["scale_tier"] else "SOMETHING IS WRONG")
