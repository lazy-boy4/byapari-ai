from fastapi import APIRouter, UploadFile, File
import pandas as pd
import shutil
import os
from app.services.insight_engine import analyze_and_generate

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):

    # Save the file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read CSV
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        return {"error": f"Could not read CSV: {str(e)}"}

    # Check required columns
    required = ["sales", "profit", "rating", "returned",
                "stock", "product_category", "payment_method"]
    missing = [col for col in required if col not in df.columns]
    if missing:
        return {
            "error": f"Missing columns: {missing}",
            "columns_found": df.columns.tolist()
        }

    # Run full analysis + insights
    result = analyze_and_generate(df)

    # Add upload info
    result["message"] = f"'{file.filename}' uploaded and analyzed successfully!"
    result["rows"] = len(df)
    result["columns"] = df.columns.tolist()

    return result