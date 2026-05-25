from fastapi import APIRouter
import pandas as pd
from app.services.insight_engine import analyze_and_generate

router = APIRouter()

@router.get("/analyze")
def analyze_data():
    df = pd.read_csv("data/sales_data.csv")
    result = analyze_and_generate(df)
    return result