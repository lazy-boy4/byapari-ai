from fastapi import APIRouter
import pandas as pd
from app.services.insight_engine import analyze_and_generate
import os

router = APIRouter()

@router.get("/analyze")
def analyze_data():
    df = pd.read_csv("data/sales_data.csv")
    result = analyze_and_generate(df)
    return result

@router.get("/analytics/categories")
def get_categories():
    path = "data/sales_data.csv"
    
    if not os.path.exists(path):
        return []
    
    try:
        df = pd.read_csv(path)
        
        grouped = (
            df.groupby("product_category")
            .agg(
                revenue=("sales", "sum"),
                orders=("sales", "count"),
                profit=("profit", "sum"),
                avg_rating=("rating", "mean"),
            )
            .reset_index()
            .rename(columns={"product_category": "name"})
        )
        
        grouped["revenue"] = grouped["revenue"].round(2)
        grouped["profit"] = grouped["profit"].round(2)
        grouped["avg_rating"] = grouped["avg_rating"].round(2)
        
        return grouped.to_dict(orient="records")
        
    except Exception as e:
        return []