# insight_engine.py
# This is the "brain" of Byapari AI
# It reads real CSV data and generates intelligent business insights
# NO hardcoded recommendations — everything comes from actual data

import pandas as pd
from typing import Any

# ─────────────────────────────────────────────
# THRESHOLDS
# These numbers decide when to trigger alerts
# You can tune these later
# ─────────────────────────────────────────────
RATING_WARNING     = 3.5   # below this → customer satisfaction alert
RATING_GOOD        = 4.5   # above this → positive feedback insight
RETURN_RATE_HIGH   = 0.15  # above 15% → operations problem
RETURN_RATE_LOW    = 0.05  # below 5%  → positive insight
LOW_STOCK_LIMIT    = 30    # below 30 units → restock alert
PROFIT_MARGIN_LOW  = 0.15  # below 15% → margin warning
PROFIT_MARGIN_HIGH = 0.35  # above 35% → strong business insight
SALES_DROP_LIMIT   = 0.20  # 20% drop vs average → revenue warning


# ─────────────────────────────────────────────
# BUSINESS HEALTH SCORE
# Single number 0-100 showing overall business health
# Calculated from: ratings, returns, stock, profit margin
# ─────────────────────────────────────────────
def calculate_health_score(df: pd.DataFrame) -> dict:
    score = 100
    breakdown = {}

    # 1. Rating score (max 25 points)
    avg_rating = df["rating"].mean()
    rating_score = min(25, round((avg_rating / 5.0) * 25))
    score_deduction = 25 - rating_score
    breakdown["rating"] = {
        "score": rating_score,
        "max": 25,
        "value": round(avg_rating, 2),
        "label": "Customer Satisfaction"
    }

    # 2. Return rate score (max 25 points)
    return_rate = len(df[df["returned"] == "Yes"]) / len(df)
    if return_rate <= 0.05:
        return_score = 25
    elif return_rate <= 0.10:
        return_score = 20
    elif return_rate <= 0.15:
        return_score = 15
    elif return_rate <= 0.25:
        return_score = 10
    else:
        return_score = 5
    breakdown["returns"] = {
        "score": return_score,
        "max": 25,
        "value": f"{round(return_rate * 100, 1)}%",
        "label": "Return Rate"
    }

    # 3. Stock health score (max 25 points)
    low_stock_count = len(df[df["stock"] < LOW_STOCK_LIMIT])
    total_products = len(df["product_name"].unique())
    low_stock_ratio = low_stock_count / max(total_products, 1)
    if low_stock_ratio <= 0.05:
        stock_score = 25
    elif low_stock_ratio <= 0.15:
        stock_score = 20
    elif low_stock_ratio <= 0.30:
        stock_score = 15
    else:
        stock_score = 8
    breakdown["stock"] = {
        "score": stock_score,
        "max": 25,
        "value": f"{low_stock_count} items low",
        "label": "Inventory Health"
    }

    # 4. Profit margin score (max 25 points)
    total_sales = df["sales"].sum()
    total_profit = df["profit"].sum()
    profit_margin = total_profit / total_sales if total_sales > 0 else 0
    if profit_margin >= 0.35:
        profit_score = 25
    elif profit_margin >= 0.25:
        profit_score = 20
    elif profit_margin >= 0.15:
        profit_score = 15
    elif profit_margin >= 0.08:
        profit_score = 10
    else:
        profit_score = 5
    breakdown["profit"] = {
        "score": profit_score,
        "max": 25,
        "value": f"{round(profit_margin * 100, 1)}%",
        "label": "Profit Margin"
    }

    # Final score
    final_score = rating_score + return_score + stock_score + profit_score

    # Health label
    if final_score >= 85:
        label = "Excellent"
        color = "#10b981"
    elif final_score >= 70:
        label = "Good"
        color = "#3b82f6"
    elif final_score >= 50:
        label = "Fair"
        color = "#f59e0b"
    else:
        label = "Needs Attention"
        color = "#ef4444"

    return {
        "score": final_score,
        "label": label,
        "color": color,
        "breakdown": breakdown
    }


# ─────────────────────────────────────────────
# INSIGHT GENERATOR
# This is the main function
# It reads your DataFrame and returns real insights
# ─────────────────────────────────────────────
def generate_insights(df: pd.DataFrame) -> list[dict]:
    insights = []

    total_orders = len(df)
    total_sales = df["sales"].sum()
    total_profit = df["profit"].sum()
    profit_margin = total_profit / total_sales if total_sales > 0 else 0

    # ── 1. Customer Rating Analysis ──────────────────
    avg_rating = df["rating"].mean()

    if avg_rating < RATING_WARNING:
        insights.append({
            "title": "⚠️ Customer Satisfaction is Critical",
            "description": f"Your average rating is {round(avg_rating, 2)}/5. This is dangerously low. Customers are unhappy — investigate product quality, delivery time, and customer service immediately.",
            "impact": "high",
            "category": "Customer Satisfaction",
            "metric": f"{round(avg_rating, 2)} / 5.0",
            "action": "Collect customer feedback and identify top complaint reasons"
        })
    elif avg_rating < 4.0:
        insights.append({
            "title": "📉 Rating Needs Improvement",
            "description": f"Average rating is {round(avg_rating, 2)}/5. You are below the industry standard of 4.0. Focus on product quality and after-sales support.",
            "impact": "medium",
            "category": "Customer Satisfaction",
            "metric": f"{round(avg_rating, 2)} / 5.0",
            "action": "Follow up with recent buyers and resolve complaints"
        })
    elif avg_rating >= RATING_GOOD:
        insights.append({
            "title": "⭐ Excellent Customer Ratings",
            "description": f"Your average rating of {round(avg_rating, 2)}/5 is outstanding! Customers love your products. Use this as a marketing advantage.",
            "impact": "low",
            "category": "Customer Satisfaction",
            "metric": f"{round(avg_rating, 2)} / 5.0",
            "action": "Feature top-rated products in promotions"
        })

    # ── 2. Return Rate Analysis ───────────────────────
    returned_count = len(df[df["returned"] == "Yes"])
    return_rate = returned_count / total_orders

    if return_rate > RETURN_RATE_HIGH:
        insights.append({
            "title": "🚨 High Return Rate Detected",
            "description": f"{round(return_rate * 100, 1)}% of orders are being returned ({returned_count} orders). This is significantly hurting your profit. Investigate top returned products immediately.",
            "impact": "high",
            "category": "Operations",
            "metric": f"{round(return_rate * 100, 1)}% return rate",
            "action": "Identify which products have the most returns and fix descriptions or quality"
        })

        # Find which category has most returns
        if "product_category" in df.columns:
            returned_df = df[df["returned"] == "Yes"]
            top_return_category = returned_df["product_category"].mode()
            if len(top_return_category) > 0:
                insights.append({
                    "title": f"📦 '{top_return_category[0]}' Category Has Most Returns",
                    "description": f"The '{top_return_category[0]}' category is driving your high return rate. Check product quality, sizing information, and delivery conditions for this category.",
                    "impact": "high",
                    "category": "Operations",
                    "metric": f"Top return category",
                    "action": f"Audit all '{top_return_category[0]}' products for quality issues"
                })

    elif return_rate < RETURN_RATE_LOW:
        insights.append({
            "title": "✅ Very Low Return Rate",
            "description": f"Only {round(return_rate * 100, 1)}% of orders are returned. This shows strong product quality and customer satisfaction.",
            "impact": "low",
            "category": "Operations",
            "metric": f"{round(return_rate * 100, 1)}% return rate",
            "action": "Maintain current quality standards"
        })

    # ── 3. Inventory / Stock Analysis ────────────────
    if "stock" in df.columns:
        low_stock_df = df[df["stock"] < LOW_STOCK_LIMIT]
        low_stock_count = len(low_stock_df)

        if low_stock_count > 0:
            # Find which products are critically low
            critical_stock = df[df["stock"] < 10]

            if len(critical_stock) > 0:
                product_names = critical_stock["product_name"].unique()[:3]
                names_str = ", ".join(product_names)
                insights.append({
                    "title": "🔴 Critical Stock Alert",
                    "description": f"{len(critical_stock)} products have less than 10 units remaining including: {names_str}. You risk losing sales TODAY if not restocked.",
                    "impact": "high",
                    "category": "Inventory",
                    "metric": f"{len(critical_stock)} critical items",
                    "action": "Place emergency restock orders immediately"
                })

            insights.append({
                "title": f"📦 {low_stock_count} Products Need Restocking",
                "description": f"{low_stock_count} products are below {LOW_STOCK_LIMIT} units. Based on current sales velocity, some may run out within days.",
                "impact": "medium",
                "category": "Inventory",
                "metric": f"{low_stock_count} low stock items",
                "action": "Review reorder points and place purchase orders"
            })

    # ── 4. Profit Margin Analysis ─────────────────────
    if profit_margin < PROFIT_MARGIN_LOW:
        insights.append({
            "title": "💸 Profit Margin is Too Low",
            "description": f"Your profit margin is only {round(profit_margin * 100, 1)}%. After costs, you are barely breaking even. Consider raising prices or reducing costs.",
            "impact": "high",
            "category": "Finance",
            "metric": f"{round(profit_margin * 100, 1)}% margin",
            "action": "Review pricing strategy and supplier costs"
        })
    elif profit_margin >= PROFIT_MARGIN_HIGH:
        insights.append({
            "title": "💰 Strong Profit Margins",
            "description": f"Excellent! Your profit margin is {round(profit_margin * 100, 1)}%. This is above industry average. You have room to invest in growth.",
            "impact": "low",
            "category": "Finance",
            "metric": f"{round(profit_margin * 100, 1)}% margin",
            "action": "Reinvest profits into marketing and inventory expansion"
        })

    # ── 5. Top Category Opportunity ───────────────────
    if "product_category" in df.columns:
        category_sales = df.groupby("product_category")["sales"].sum()
        top_category = category_sales.idxmax()
        top_category_share = category_sales.max() / total_sales * 100

        insights.append({
            "title": f"🏆 '{top_category}' is Your Best Category",
            "description": f"'{top_category}' generates {round(top_category_share, 1)}% of your total revenue. Double down on this category with more inventory and promotions.",
            "impact": "medium",
            "category": "Growth",
            "metric": f"{round(top_category_share, 1)}% of revenue",
            "action": f"Expand '{top_category}' product range and run targeted promotions"
        })

    # ── 6. Payment Method Insight ─────────────────────
    if "payment_method" in df.columns:
        payment_counts = df["payment_method"].value_counts()
        top_payment = payment_counts.index[0]
        top_payment_pct = payment_counts.iloc[0] / total_orders * 100

        if top_payment in ["bKash", "Nagad", "Rocket"]:
            insights.append({
                "title": f"📱 {top_payment} Dominates Payments",
                "description": f"{round(top_payment_pct, 1)}% of customers pay via {top_payment}. Make sure your {top_payment} checkout is smooth and offer {top_payment} exclusive discounts.",
                "impact": "medium",
                "category": "Payments",
                "metric": f"{round(top_payment_pct, 1)}% usage",
                "action": f"Create {top_payment} cashback promotions to increase order volume"
            })

    # ── 7. City / Location Insight ────────────────────
    if "customer_city" in df.columns:
        city_sales = df.groupby("customer_city")["sales"].sum()
        top_city = city_sales.idxmax()
        top_city_share = city_sales.max() / total_sales * 100

        bottom_city = city_sales.idxmin()

        insights.append({
            "title": f"📍 {top_city} is Your Strongest Market",
            "description": f"{top_city} contributes {round(top_city_share, 1)}% of total sales. Focus delivery speed and marketing here for maximum ROI.",
            "impact": "medium",
            "category": "Geography",
            "metric": f"{round(top_city_share, 1)}% of sales",
            "action": f"Prioritize same-day delivery in {top_city} and run local ads"
        })

        insights.append({
            "title": f"📍 {bottom_city} is Underperforming",
            "description": f"{bottom_city} has the lowest sales in your data. Either increase marketing there or investigate delivery/logistics issues.",
            "impact": "low",
            "category": "Geography",
            "metric": f"Lowest sales city",
            "action": f"Run a test promotion in {bottom_city} to gauge demand"
        })

    # ── 8. Quick Win Opportunity ──────────────────────
    # Find highest rated but lowest sales product
    if "product_name" in df.columns:
        product_stats = df.groupby("product_name").agg(
            avg_rating=("rating", "mean"),
            total_sales=("sales", "sum"),
            total_orders=("sales", "count")
        ).reset_index()

        # Hidden gem: high rating but low orders
        hidden_gems = product_stats[
            (product_stats["avg_rating"] >= 4.2) &
            (product_stats["total_orders"] <= product_stats["total_orders"].quantile(0.25))
        ]

        if len(hidden_gems) > 0:
            gem = hidden_gems.sort_values("avg_rating", ascending=False).iloc[0]
            insights.append({
                "title": f"💎 Hidden Gem: '{gem['product_name']}'",
                "description": f"'{gem['product_name']}' has a {round(gem['avg_rating'], 1)}/5 rating but very few orders. This product is undermarketed — promote it and watch sales grow.",
                "impact": "medium",
                "category": "Growth",
                "metric": f"{round(gem['avg_rating'], 1)} rating, low visibility",
                "action": "Feature this product on homepage and run a flash sale"
            })

    return insights


# ─────────────────────────────────────────────
# MAIN FUNCTION — called by your API endpoints
# ─────────────────────────────────────────────
def analyze_and_generate(df: pd.DataFrame) -> dict[str, Any]:
    """
    Main function that takes a DataFrame and returns:
    - kpis: all business metrics
    - insights: AI-generated recommendations
    - health_score: overall business health 0-100
    """

    # Calculate KPIs
    total_orders = len(df)
    total_sales = float(df["sales"].sum())
    total_profit = float(df["profit"].sum())
    avg_rating = round(float(df["rating"].mean()), 2)
    returned_orders = len(df[df["returned"] == "Yes"])
    top_category = df["product_category"].mode()[0] if "product_category" in df.columns else "N/A"
    most_used_payment = df["payment_method"].mode()[0] if "payment_method" in df.columns else "N/A"
    low_stock_products = len(df[df["stock"] < LOW_STOCK_LIMIT]) if "stock" in df.columns else 0

    kpis = {
        "total_orders": total_orders,
        "total_sales": total_sales,
        "total_profit": total_profit,
        "average_rating": avg_rating,
        "returned_orders": returned_orders,
        "top_category": top_category,
        "most_used_payment_method": most_used_payment,
        "low_stock_products": low_stock_products,
    }

    # Generate insights
    insights = generate_insights(df)

    # Calculate health score
    health_score = calculate_health_score(df)

    return {
        "kpis": kpis,
        "insights": insights,
        "health_score": health_score,
    }