import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def generate_sales_forecast(df):
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")
    df["date_ordinal"] = df["date"].map(pd.Timestamp.toordinal)

    X = df["date_ordinal"].values.reshape(-1, 1)
    y = df["sales"].values

    model = LinearRegression()
    model.fit(X, y)

    last_date = df["date"].max()
    future_dates = [last_date + pd.Timedelta(days=i) for i in range(1, 8)]
    future_ordinal = np.array([d.toordinal() for d in future_dates]).reshape(-1, 1)

    predictions = model.predict(future_ordinal)

    forecast_data = []
    for date, pred in zip(future_dates, predictions):
        forecast_data.append({
            "date": str(date.date()),
            "predicted_sales": round(float(pred), 2)
        })

    return forecast_data