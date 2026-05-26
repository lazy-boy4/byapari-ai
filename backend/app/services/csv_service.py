import pandas as pd


# ─────────────────────────────────────────────
# BASIC KPI CALCULATION
# ─────────────────────────────────────────────

def calculate_kpis(df):
    return {
        "total_orders": len(df),
        "total_sales": float(df["sales"].sum()),
        "total_profit": float(df["profit"].sum()),
        "average_rating": round(df["rating"].mean(), 2),
        "returned_orders": int((df["returned"] == "Yes").sum()),
        "top_category": df["product_category"].mode()[0],
        "most_used_payment_method": df["payment_method"].mode()[0],
        "low_stock_products": int((df["stock"] < 30).sum()),
    }


# ─────────────────────────────────────────────
# SALES TREND CHART DATA
# ─────────────────────────────────────────────

def generate_sales_trend(df):

    df["date"] = pd.to_datetime(df["date"])

    monthly = (
        df.groupby(df["date"].dt.strftime("%b"))["sales"]
        .agg(["sum", "count"])
        .reset_index()
    )

    return [
        {
            "date": row["date"],
            "revenue": round(row["sum"], 2),
            "orders": int(row["count"]),
        }
        for _, row in monthly.iterrows()
    ]


# ─────────────────────────────────────────────
# TOP PRODUCTS CHART DATA
# ─────────────────────────────────────────────

def generate_top_products(df):

    grouped = (
        df.groupby("product_name")["sales"]
        .sum()
        .sort_values(ascending=False)
        .head(5)
        .reset_index()
    )

    return [
        {
            "name": row["product_name"],
            "revenue": round(row["sales"], 2),
            "units": 0,
        }
        for _, row in grouped.iterrows()
    ]


# ─────────────────────────────────────────────
# MAIN CSV PROCESSOR
# ─────────────────────────────────────────────

async def process_csv(file):

    df = pd.read_csv(file.file)

    kpis = calculate_kpis(df)

    sales_trend = generate_sales_trend(df)

    top_products = generate_top_products(df)

    return {
        "columns": df.columns.tolist(),
        "rows": len(df),
        "kpis": kpis,
        "sales_trend": sales_trend,
        "top_products": top_products,
    }