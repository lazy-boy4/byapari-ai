from fastapi import APIRouter, UploadFile, File
import pandas as pd
import shutil
import os
from app.services.insight_engine import analyze_and_generate
from app.services.csv_service import generate_sales_trend, generate_top_products

router = APIRouter()

UPLOAD_DIR = "uploads"
DATA_PATH = "data/sales_data.csv"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs("data", exist_ok=True)

# ── REQUIRED COLUMNS ──
REQUIRED_COLUMNS = [
    "date", "product_name", "product_category", "sales",
    "profit", "quantity", "rating", "returned",
    "stock", "payment_method", "customer_city"
]

# ── COLUMN DEFAULTS FOR AUTO-FIX ──
COLUMN_DEFAULTS = {
    "rating": 4.0,
    "stock": 100,
    "returned": "No",
    "quantity": 1,
    "profit": 0,
    "sales": 0,
    "customer_city": "Dhaka",
    "payment_method": "Cash on Delivery",
    "product_category": "General",
}

def normalize_returned(val):
    """Handle 'yes', 'YES', 'y', '1' → 'Yes' and 'no', 'NO', 'n', '0' → 'No'"""
    if pd.isna(val):
        return "No"
    s = str(val).strip().lower()
    if s in ["yes", "y", "1", "true"]:
        return "Yes"
    return "No"

def normalize_rating(val):
    """Clamp rating to 1-5, default 4.0"""
    try:
        r = float(val)
        if pd.isna(r):
            return 4.0
        return max(1.0, min(5.0, r))
    except:
        return 4.0

def parse_date_safe(val):
    """Try multiple date formats"""
    if pd.isna(val):
        return None
    formats = ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%Y/%m/%d"]
    for fmt in formats:
        try:
            return pd.to_datetime(str(val), format=fmt)
        except:
            continue
    try:
        return pd.to_datetime(str(val), dayfirst=True)
    except:
        return None

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    # ── 1. Validate file type ──
    if not file.filename.endswith(".csv"):
        return {
            "error": "Invalid file type",
            "detail": "Only .csv files are supported. Please upload a CSV file.",
            "received": file.filename
        }

    # ── 2. Save file ──
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ── 3. Read CSV ──
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        return {
            "error": "Cannot read CSV",
            "detail": f"The file could not be parsed as CSV. Error: {str(e)}",
            "hint": "Make sure the file is a valid CSV with comma-separated values, not Excel (.xlsx) or other formats."
        }

    # ── 4. Check if empty ──
    if len(df) == 0:
        return {
            "error": "Empty CSV",
            "detail": "The CSV file has 0 rows of data.",
            "hint": "Please include at least one data row below the header."
        }

    # ── 5. Check required columns ──
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        # Suggest similar column names (typo detection)
        suggestions = []
        for missing in missing_cols:
            close = [c for c in df.columns if missing.lower() in c.lower() or c.lower() in missing.lower()]
            if close:
                suggestions.append(f"Did you mean '{close[0]}' instead of '{missing}'?")
        
        return {
            "error": "Missing required columns",
            "missing_columns": missing_cols,
            "columns_found": df.columns.tolist(),
            "suggestions": suggestions,
            "required_columns": REQUIRED_COLUMNS,
            "hint": f"Your CSV is missing {len(missing_cols)} required column(s). Please add them and re-upload."
        }

    # ── 6. Auto-fix data quality issues ──
    fixes_report = []
    rows_before = len(df)

    # Fix dates
    df["date_parsed"] = df["date"].apply(parse_date_safe)
    bad_dates = df["date_parsed"].isna().sum()
    if bad_dates > 0:
        # Drop rows with unparseable dates
        df = df[df["date_parsed"].notna()].copy()
        fixes_report.append(f"Dropped {bad_dates} rows with invalid dates")
    df["date"] = df["date_parsed"]
    df.drop(columns=["date_parsed"], inplace=True)

    # Fix returned column
    if df["returned"].dtype == object:
        df["returned"] = df["returned"].apply(normalize_returned)
    else:
        # If numeric (0/1), convert
        df["returned"] = df["returned"].apply(lambda x: "Yes" if str(x) in ["1", "1.0", "True", "true"] else "No")

    # Fix rating
    df["rating"] = df["rating"].apply(normalize_rating)
    bad_ratings = (df["rating"] == 4.0) & (df["rating"].isna())  # Actually we set default, so this is fine

    # Fill missing numeric values with defaults
    for col, default in COLUMN_DEFAULTS.items():
        if col in df.columns:
            missing_count = df[col].isna().sum()
            if missing_count > 0:
                df[col] = df[col].fillna(default)
                fixes_report.append(f"Filled {missing_count} missing values in '{col}' with {default}")

    # Ensure numeric columns are actually numeric
    numeric_cols = ["sales", "profit", "quantity", "stock"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    rows_after = len(df)
    rows_dropped = rows_before - rows_after

    # ── 7. Copy to canonical location ──
    shutil.copy(file_path, DATA_PATH)

    # ── 8. Run analysis ──
    try:
        result = analyze_and_generate(df)
    except Exception as e:
        return {
            "error": "Analysis failed",
            "detail": f"Data validation passed but analysis engine failed: {str(e)}",
            "hint": "This might be due to unexpected data patterns. Please check your CSV format."
        }

    # Ensure all response fields
    if "sales_trend" not in result:
        result["sales_trend"] = generate_sales_trend(df)
    if "top_products" not in result:
        result["top_products"] = generate_top_products(df)

    # ── 9. Return success with quality report ──
    result["message"] = f"'{file.filename}' uploaded and analyzed successfully!"
    result["rows"] = rows_after
    result["columns"] = df.columns.tolist()
    result["data_quality"] = {
        "rows_uploaded": rows_before,
        "rows_analyzed": rows_after,
        "rows_dropped": rows_dropped,
        "fixes_applied": fixes_report,
        "warnings": [] if not fixes_report else ["Some data was auto-corrected. See fixes_applied for details."]
    }

    return result