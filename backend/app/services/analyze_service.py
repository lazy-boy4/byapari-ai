import pandas as pd

async def analyze_csv(file):
    df = pd.read_csv(file.file)

    analysis = {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": df.columns.tolist(),
        "missing_values": df.isnull().sum().to_dict(),
        "numeric_analysis": {}
    }

    numeric_columns = df.select_dtypes(include=['number']).columns

    for col in numeric_columns:
        analysis["numeric_analysis"][col] = {
            "average": float(df[col].mean()),
            "max": float(df[col].max()),
            "min": float(df[col].min())
        }

    return analysis