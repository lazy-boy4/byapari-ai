import pandas as pd
import numpy as np
from prophet import Prophet

def generate_sales_forecast(df):
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    
    # Aggregate daily sales
    daily_sales = df.groupby(df["date"].dt.date).agg({
        "sales": "sum"
    }).reset_index()
    daily_sales.columns = ["ds", "y"]
    daily_sales["ds"] = pd.to_datetime(daily_sales["ds"])
    
    if len(daily_sales) < 2:
        last_date = daily_sales["ds"].max() if len(daily_sales) > 0 else pd.Timestamp.now()
        avg_sales = daily_sales["y"].mean() if len(daily_sales) > 0 else 0
        return [{"date": str((last_date + pd.Timedelta(days=i)).date()), "predicted_sales": round(float(avg_sales), 2), "lower_bound": round(float(avg_sales)*0.9, 2), "upper_bound": round(float(avg_sales)*1.1, 2)} for i in range(1, 8)]
    
    # AGGRESSIVE SETTINGS for visible waves
    model = Prophet(
        growth='linear',
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False,
        changepoint_prior_scale=0.8,      # Very flexible trend
        seasonality_prior_scale=20.0,      # Strong seasonality
        holidays_prior_scale=15.0,
        interval_width=0.95,
    )
    
    # Bangladesh holidays
    holidays = pd.DataFrame({
        'holiday': 'eid_al_fitr',
        'ds': pd.to_datetime(['2024-04-10', '2024-04-11', '2025-03-31', '2026-03-20']),
        'lower_window': -3,
        'upper_window': 3,
    })
    model = Prophet(holidays=holidays)
    
    model.fit(daily_sales)
    
    future = model.make_future_dataframe(periods=7)
    forecast = model.predict(future)
    forecast_future = forecast.tail(7)
    
    forecast_data = []
    for _, row in forecast_future.iterrows():
        forecast_data.append({
            "date": str(row["ds"].date()),
            "predicted_sales": round(float(row["yhat"]), 2),
            "lower_bound": round(float(row["yhat_lower"]), 2),
            "upper_bound": round(float(row["yhat_upper"]), 2),
        })
    
    return forecast_data