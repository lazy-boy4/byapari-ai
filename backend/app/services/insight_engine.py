from datetime import datetime
from typing import Any

import pandas as pd

# =========================================================
# CONFIG
# =========================================================

RATING_WARNING = 3.5
RATING_GOOD = 4.5

RETURN_RATE_HIGH = 0.15
RETURN_RATE_LOW = 0.05

LOW_STOCK_LIMIT = 30

# =========================================================
# HELPERS
# =========================================================

def create_insight(
    insight_type: str,
    title: str,
    message: str,
    priority: str = "medium",
    confidence: int = 85,
):
    return {
        "type": insight_type,
        "title": title,
        "message": message,
        "priority": priority,
        "confidence": confidence,
    }


def safe_mean(df: pd.DataFrame, column: str):
    if column not in df.columns:
        return 0
    return float(df[column].mean())


def safe_sum(df: pd.DataFrame, column: str):
    if column not in df.columns:
        return 0
    return float(df[column].sum())


# =========================================================
# MAIN ENGINE
# =========================================================

def generate_insights(
    csv_data: list[dict] | pd.DataFrame,
    lang: str = "en",
):
    if isinstance(csv_data, list):
        df = pd.DataFrame(csv_data)
    else:
        df = csv_data.copy()

    insights = []

    if len(df) == 0:
        return {
            "insights": [],
            "health_score": 0,
            "top_performer": None,
            "worst_performer": None,
            "period_analyzed": "No data",
            "confidence": 0,
            "generated_at": datetime.utcnow().isoformat(),
            "data_points": 0,
        }

    # =====================================================
    # BASIC CLEANING
    # =====================================================

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")

    health_score = 75

    # =====================================================
    # KPI CALCULATIONS
    # =====================================================

    total_sales = safe_sum(df, "sales")
    total_profit = safe_sum(df, "profit")

    avg_rating = safe_mean(df, "rating")

    # =====================================================
    # TOP / WORST PRODUCTS
    # =====================================================

    top_performer = None
    worst_performer = None

    if "product_name" in df.columns and "sales" in df.columns:

        grouped = (
            df.groupby("product_name")["sales"]
            .sum()
            .sort_values(ascending=False)
        )

        if len(grouped) > 0:

            top_performer = {
                "product": grouped.index[0],
                "revenue": round(float(grouped.iloc[0]), 2),
            }

            worst_performer = {
                "product": grouped.index[-1],
                "revenue": round(float(grouped.iloc[-1]), 2),
            }

            insights.append(
                create_insight(
                    "growth",
                    "Top Performer",
                    f"{grouped.index[0]} generated the highest sales.",
                    "medium",
                    95,
                )
            )

            insights.append(
                create_insight(
                    "warning",
                    "Weak Product",
                    f"{grouped.index[-1]} is underperforming.",
                    "medium",
                    87,
                )
            )

    # =====================================================
    # SALES TREND ANALYSIS
    # =====================================================

    if "sales" in df.columns and "date" in df.columns:

        recent = (
            df.sort_values("date")
            .tail(20)
        )

        if len(recent) >= 10:

            midpoint = len(recent) // 2

            old_sales = recent.iloc[:midpoint]["sales"].sum()
            new_sales = recent.iloc[midpoint:]["sales"].sum()

            if old_sales > 0:

                growth = ((new_sales - old_sales) / old_sales) * 100

                if growth > 15:

                    insights.append(
                        create_insight(
                            "growth",
                            "Sales Growth Detected",
                            f"Sales increased by {round(growth,1)}% recently.",
                            "high",
                            93,
                        )
                    )

                    health_score += 10

                elif growth < -15:

                    insights.append(
                        create_insight(
                            "warning",
                            "Sales Decline Detected",
                            f"Sales dropped by {abs(round(growth,1))}%. Consider promotions.",
                            "high",
                            92,
                        )
                    )

                    health_score -= 15

    # =====================================================
    # CUSTOMER SATISFACTION
    # =====================================================

    if avg_rating >= RATING_GOOD:

        insights.append(
            create_insight(
                "success",
                "Excellent Customer Satisfaction",
                f"Average rating is {round(avg_rating,1)}/5.",
                "medium",
                90,
            )
        )

        health_score += 5

    elif avg_rating < RATING_WARNING:

        insights.append(
            create_insight(
                "warning",
                "Customer Satisfaction Risk",
                f"Average rating is only {round(avg_rating,1)}/5.",
                "high",
                89,
            )
        )

        health_score -= 10

    # =====================================================
    # RETURN RATE ANALYSIS
    # =====================================================

    if "returned" in df.columns:

        returned_orders = len(df[df["returned"] == "Yes"])

        return_rate = returned_orders / len(df)

        if return_rate > RETURN_RATE_HIGH:

            insights.append(
                create_insight(
                    "risk",
                    "High Return Rate",
                    f"Return rate is {round(return_rate*100,1)}%.",
                    "high",
                    91,
                )
            )

            health_score -= 10

        elif return_rate < RETURN_RATE_LOW:

            insights.append(
                create_insight(
                    "success",
                    "Healthy Return Rate",
                    f"Return rate is only {round(return_rate*100,1)}%.",
                    "low",
                    88,
                )
            )

            health_score += 5

    # =====================================================
    # INVENTORY ANALYSIS
    # =====================================================

    if "stock" in df.columns:

        low_stock = df[df["stock"] < LOW_STOCK_LIMIT]

        if len(low_stock) > 0:

            insights.append(
                create_insight(
                    "inventory",
                    "Low Stock Alert",
                    f"{len(low_stock)} products need restocking.",
                    "high",
                    94,
                )
            )

            health_score -= 8

        else:

            insights.append(
                create_insight(
                    "success",
                    "Inventory Healthy",
                    "All products have healthy stock levels.",
                    "low",
                    84,
                )
            )

            health_score += 3

    # =====================================================
    # DEAD INVENTORY
    # =====================================================

    if "stock" in df.columns and "sales" in df.columns:

        dead_stock = df[
            (df["stock"] > 50)
            & (df["sales"] < 5)
        ]

        if len(dead_stock) > 0:

            insights.append(
                create_insight(
                    "risk",
                    "Dead Inventory Risk",
                    f"{len(dead_stock)} products have high stock but weak sales.",
                    "high",
                    90,
                )
            )

            health_score -= 12

    # =====================================================
    # FINAL SCORE
    # =====================================================

    health_score = max(0, min(100, health_score))

    # =====================================================
    # DATE RANGE
    # =====================================================

    period_analyzed = "Unknown"

    if "date" in df.columns:

        valid_dates = df[df["date"].notna()]["date"]

        if len(valid_dates) > 0:

            period_analyzed = (
                f"{valid_dates.min().strftime('%Y-%m-%d')} "
                f"to "
                f"{valid_dates.max().strftime('%Y-%m-%d')}"
            )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {
        "insights": insights,
        "health_score": int(health_score),
        "top_performer": top_performer,
        "worst_performer": worst_performer,
        "period_analyzed": period_analyzed,
        "confidence": 91,
        "generated_at": datetime.utcnow().isoformat(),
        "data_points": len(df),
    }


# =========================================================
# MAIN ANALYSIS WRAPPER
# =========================================================

def analyze_and_generate(
    df: pd.DataFrame,
    lang: str = "en",
) -> dict[str, Any]:

    result = generate_insights(df, lang)

    kpis = {
        "total_orders": len(df),
        "total_sales": safe_sum(df, "sales"),
        "total_profit": safe_sum(df, "profit"),
        "average_rating": round(safe_mean(df, "rating"), 2),
        "returned_orders": (
            len(df[df["returned"] == "Yes"])
            if "returned" in df.columns
            else 0
        ),
        "low_stock_products": (
            len(df[df["stock"] < LOW_STOCK_LIMIT])
            if "stock" in df.columns
            else 0
        ),
         "top_category": (
        df["product_category"].mode()[0]
        if "product_category" in df.columns and len(df) > 0 else "N/A"
        ),
        "most_used_payment_method": (
            df["payment_method"].mode()[0]
            if "payment_method" in df.columns and len(df) > 0 else "N/A"
        ),
    }

    from app.services.csv_service import (
        generate_sales_trend,
        generate_top_products,
    )

    sales_trend = generate_sales_trend(df)
    top_products = generate_top_products(df)

    return {
        "kpis": kpis,
        "insights": result["insights"],
        "health_score": result["health_score"],
        "top_performer": result["top_performer"],
        "worst_performer": result["worst_performer"],
        "period_analyzed": result["period_analyzed"],
        "confidence": result["confidence"],
        "generated_at": result["generated_at"],
        "data_points": result["data_points"],
        "sales_trend": sales_trend,
        "top_products": top_products,
    }