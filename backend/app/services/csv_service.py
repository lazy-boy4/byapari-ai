import pandas as pd

async def process_csv(file):
    df = pd.read_csv(file.file)

    return {
        "columns": df.columns.tolist(),
        "rows": len(df)
    }