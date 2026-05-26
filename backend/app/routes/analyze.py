from fastapi import APIRouter
import pandas as pd
from app.services.insight_engine import analyze_and_generate

router = APIRouter()

# ── Main analytics endpoint ──────────────────────────────────
# Returns: kpis + insights + health_score
@router.get("/analyze")
def analyze_data():
    df = pd.read_csv("data/sales_data.csv")
    result = analyze_and_generate(df)
    return result


# ── Sales Trend endpoint ──────────────────────────────────────
# Returns monthly revenue and orders from real CSV data
@router.get("/analytics/sales-trend")
def sales_trend():
    df = pd.read_csv("data/sales_data.csv")

    # Convert date column to datetime
    df["date"] = pd.to_datetime(df["date"])

    # Group by month
    df["month"] = df["date"].dt.strftime("%b")
    df["month_num"] = df["date"].dt.month

    monthly = (
        df.groupby(["month_num", "month"])
        .agg(revenue=("sales", "sum"), orders=("sales", "count"))
        .reset_index()
        .sort_values("month_num")
    )

    return [
        {
            "date": row["month"],
            "revenue": round(float(row["revenue"]), 2),
            "orders": int(row["orders"]),
        }
        for _, row in monthly.iterrows()
    ]


# ── Top Products endpoint ─────────────────────────────────────
# Returns top 5 products by revenue
@router.get("/analytics/top-products")
def top_products():
    df = pd.read_csv("data/sales_data.csv")

    product_stats = (
        df.groupby("product_name")
        .agg(revenue=("sales", "sum"), units=("quantity", "sum"))
        .reset_index()
        .sort_values("revenue", ascending=False)
        .head(5)
    )

    return [
        {
            "name": row["product_name"],
            "revenue": round(float(row["revenue"]), 2),
            "units": int(row["units"]),
        }
        for _, row in product_stats.iterrows()
    ]


# ── Category breakdown endpoint ───────────────────────────────
# Returns sales by category — used in Products page
@router.get("/analytics/categories")
def category_breakdown():
    df = pd.read_csv("data/sales_data.csv")

    cat_stats = (
        df.groupby("product_category")
        .agg(
            revenue=("sales", "sum"),
            orders=("sales", "count"),
            profit=("profit", "sum"),
            avg_rating=("rating", "mean"),
        )
        .reset_index()
        .sort_values("revenue", ascending=False)
    )

    return [
        {
            "name": row["product_category"],
            "revenue": round(float(row["revenue"]), 2),
            "orders": int(row["orders"]),
            "profit": round(float(row["profit"]), 2),
            "avg_rating": round(float(row["avg_rating"]), 2),
        }
        for _, row in cat_stats.iterrows()
    ]


# ── City breakdown endpoint ───────────────────────────────────
# Returns sales by city — used in Products/Analytics page
@router.get("/analytics/cities")
def city_breakdown():
    df = pd.read_csv("data/sales_data.csv")

    city_stats = (
        df.groupby("customer_city")
        .agg(revenue=("sales", "sum"), orders=("sales", "count"))
        .reset_index()
        .sort_values("revenue", ascending=False)
    )

    return [
        {
            "city": row["customer_city"],
            "revenue": round(float(row["revenue"]), 2),
            "orders": int(row["orders"]),
        }
        for _, row in city_stats.iterrows()
    ]