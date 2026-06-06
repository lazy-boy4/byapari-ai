import pandas as pd
from typing import List, Dict, Tuple
from datetime import timedelta


def calculate_sales_velocity(df: pd.DataFrame, product: str, days: int = 30) -> float:
    """Average daily sales over last N days, relative to the dataset's own max date."""
    max_date = pd.to_datetime(df["date"]).max()
    cutoff = max_date - timedelta(days=days)
    product_sales = df[
        (df["product_name"] == product) &
        (pd.to_datetime(df["date"]) >= cutoff)
    ]["sales"].sum()
    return round(float(product_sales) / days, 2)


def calculate_return_rate(df: pd.DataFrame, product: str) -> float:
    """Return rate for a product — handles Yes/yes/YES/1/True."""
    product_df = df[df["product_name"] == product]
    if len(product_df) == 0:
        return 0.0
    normalized = product_df["returned"].astype(str).str.strip().str.lower()
    returns = int(normalized.isin(["yes", "1", "true"]).sum())
    return round(returns / len(product_df), 3)


def calculate_stock_turnover(df: pd.DataFrame, product: str) -> float:
    """Days of stock remaining at current sales rate."""
    product_df = df[df["product_name"] == product]
    if len(product_df) == 0:
        return 0.0
    avg_daily_qty = float(product_df["quantity"].sum()) / max(len(product_df), 1)
    current_stock = float(product_df["stock"].iloc[-1]) if "stock" in product_df.columns else 0
    if avg_daily_qty <= 0:
        return 9999.0  # no sales recorded — stock effectively unlimited
    return round(current_stock / avg_daily_qty, 1)


def generate_pricing_suggestions(df: pd.DataFrame) -> Tuple[List[Dict], int, int]:
    """
    Returns (actionable_suggestions, stable_count, total_products).
    - actionable_suggestions: sorted by priority, capped at 50, excludes "monitor"
    - stable_count: products with no action needed
    - total_products: total unique products analyzed
    """
    all_suggestions = []

    for product_name, product_df in df.groupby("product_name"):
        if len(product_df) < 3:
            continue

        total_sales = float(product_df["sales"].sum())
        total_profit = float(product_df["profit"].sum())
        avg_rating = float(product_df["rating"].mean()) if "rating" in product_df.columns else 4.0
        current_stock = float(product_df["stock"].iloc[-1]) if "stock" in product_df.columns else 100
        return_rate = calculate_return_rate(df, product_name)
        velocity = calculate_sales_velocity(df, product_name)
        stock_days = calculate_stock_turnover(df, product_name)
        profit_margin = (total_profit / total_sales * 100) if total_sales > 0 else 0

        s = {
            "product": product_name,
            "current_metrics": {
                "total_sales": round(total_sales, 2),
                "profit_margin": round(profit_margin, 1),
                "avg_rating": round(avg_rating, 1),
                "return_rate": return_rate,
                "stock_days_remaining": stock_days,
                "velocity": velocity,
            },
            "suggestion": "monitor",
            "reason": "stable",
            "price_change_percent": 0,
            "priority": "low",
            "expected_impact": "Current pricing is optimal, monitor trends",
            "action_text": "Monitor pricing — current levels are optimal",
            "action_text_bn": "দাম পর্যবেক্ষণ করুন — বর্তমান মাত্রা ঠিক আছে",
        }

        if return_rate > 0.15:
            s.update(
                suggestion="reduce_price", reason="high_return_rate",
                price_change_percent=-15, priority="high",
                expected_impact="Clear old stock, reduce returns, improve cash flow",
                action_text="Reduce price by 15% — high return rate suggests overpricing",
                action_text_bn="দাম ১৫% কমান — উচ্চ রিটার্ন হার দাম বেশি বলে ইঙ্গিত দিচ্ছে",
            )
        elif current_stock < 30 and velocity > 0:
            s.update(
                suggestion="increase_price", reason="scarcity_premium",
                price_change_percent=10, priority="high",
                expected_impact="Capture scarcity premium before restock",
                action_text="Increase price by 10% — low stock with demand",
                action_text_bn="দাম ১০% বাড়ান — কম স্টক কিন্তু চাহিদা আছে",
            )
        elif current_stock > 80 and velocity < 5:
            s.update(
                suggestion="clearance", reason="dead_inventory",
                price_change_percent=-30, priority="medium",
                expected_impact="Free up capital, reduce storage costs",
                action_text="Run 30% clearance — dead stock taking up capital",
                action_text_bn="৩০% clearance করুন — মৃত স্টক ক্যাপিটাল বেঁধে রেখেছে",
            )
        elif profit_margin < 15:
            s.update(
                suggestion="bundle", reason="low_margin",
                price_change_percent=0, priority="medium",
                expected_impact="Bundle with high-margin items to improve overall profit",
                action_text="Bundle with top performer — thin margin needs volume",
                action_text_bn="সেরা পণ্যের সাথে বান্ডেল করুন — কম মার্জিনে ভলিউম দরকার",
            )
        elif avg_rating >= 4.5 and current_stock > 20:
            s.update(
                suggestion="increase_price", reason="quality_premium",
                price_change_percent=5, priority="low",
                expected_impact="Customers love this — capture quality premium",
                action_text="Increase price by 5% — excellent rating supports premium",
                action_text_bn="দাম ৫% বাড়ান — চমৎকার রেটিং প্রিমিয়াম দাম সমর্থন করে",
            )
        elif current_stock > 60 and velocity < 10:
            s.update(
                suggestion="clearance", reason="slow_moving",
                price_change_percent=-20, priority="medium",
                expected_impact="Boost sales velocity, free warehouse space",
                action_text="Run 20% promotion — slow moving inventory",
                action_text_bn="২০% প্রমোশন করুন — ধীর গতির ইনভেন্টরি",
            )

        all_suggestions.append(s)

    priority_order = {"high": 0, "medium": 1, "low": 2}
    all_suggestions.sort(key=lambda x: priority_order.get(x["priority"], 3))

    actionable = [s for s in all_suggestions if s["suggestion"] != "monitor"]
    stable_count = len(all_suggestions) - len(actionable)
    total_products = len(all_suggestions)

    return actionable[:50], stable_count, total_products


def get_pricing_summary(
    suggestions: List[Dict],
    stable_count: int = 0,
    total_products: int = 0,
    lang: str = "en",
) -> Dict:
    if not suggestions and stable_count == 0:
        return {
            "total_opportunities": 0,
            "revenue_at_risk": 0,
            "potential_uplift": 0,
            "top_priority": None,
            "stable_products": 0,
            "total_products": 0,
        }

    potential_uplift = sum(
        s["current_metrics"]["total_sales"] * (s["price_change_percent"] / 100)
        for s in suggestions if s["price_change_percent"] > 0
    )
    revenue_at_risk = sum(
        s["current_metrics"]["total_sales"]
        for s in suggestions if s["priority"] == "high"
    )
    high_priority = [s for s in suggestions if s["priority"] == "high"]

    return {
        "total_opportunities": len(suggestions),
        "revenue_at_risk": round(revenue_at_risk, 2),
        "potential_uplift": round(potential_uplift, 2),
        "top_priority": high_priority[0]["product"] if high_priority else None,
        "stable_products": stable_count,
        "total_products": total_products or len(suggestions),
        "lang": lang,
    }
