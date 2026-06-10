"""
Merchant Personalization Engine.

Builds an explicit merchant profile from the uploaded sales data and uses it
to tailor every downstream AI output. The same numbers mean different things
for a micro fashion seller in Khulna and a growing electronics retailer in
Dhaka — this module is what makes the advice *theirs*.

The profile is returned to the UI (`merchant_profile`) and serialized into a
summary that conditions the LLM prompt, so recommendations adapt to business
type, scale, digital-payment adoption, and geographic concentration.
"""

import pandas as pd

DIGITAL_PAYMENT_KEYWORDS = ("bkash", "nagad", "rocket", "card", "bank", "online", "qr")


def _scale_tier(total_orders: int, total_sales: float) -> tuple[str, str]:
    if total_orders < 50 or total_sales < 50_000:
        return "micro", "মাইক্রো ব্যবসা"
    if total_orders < 300 or total_sales < 500_000:
        return "small", "ছোট ব্যবসা"
    return "growing", "ক্রমবর্ধমান ব্যবসা"


def build_merchant_profile(df: pd.DataFrame, lang: str = "en") -> dict:
    total_orders = len(df)
    total_sales = float(df["sales"].sum()) if "sales" in df.columns else 0.0

    # ── business type: category mix ─────────────────────────────────
    business_type = "general"
    category_mix = []
    if "product_category" in df.columns and total_orders > 0:
        shares = (df.groupby("product_category")["sales"].sum() / (total_sales or 1)).sort_values(ascending=False)
        category_mix = [
            {"category": str(cat), "share_pct": round(float(share) * 100, 1)}
            for cat, share in shares.head(3).items()
        ]
        if len(shares) > 0:
            dominant_share = float(shares.iloc[0])
            business_type = (
                f"{shares.index[0]}-focused" if dominant_share > 0.6
                else "multi-category"
            )

    # ── scale ───────────────────────────────────────────────────────
    tier_en, tier_bn = _scale_tier(total_orders, total_sales)

    # ── digital adoption ────────────────────────────────────────────
    digital_pct = 0.0
    if "payment_method" in df.columns and total_orders > 0:
        methods = df["payment_method"].astype(str).str.lower()
        digital = methods.apply(lambda m: any(k in m for k in DIGITAL_PAYMENT_KEYWORDS))
        digital_pct = round(float(digital.mean()) * 100, 1)

    # ── geographic concentration ────────────────────────────────────
    top_city, city_concentration_pct = None, 0.0
    if "customer_city" in df.columns and total_orders > 0:
        city_counts = df["customer_city"].astype(str).value_counts()
        top_city = str(city_counts.index[0])
        city_concentration_pct = round(float(city_counts.iloc[0]) / total_orders * 100, 1)

    # ── risk flags & strengths ──────────────────────────────────────
    risk_flags, strengths = [], []
    if "returned" in df.columns and total_orders > 0:
        return_rate = len(df[df["returned"] == "Yes"]) / total_orders
        if return_rate > 0.15:
            risk_flags.append("high_return_rate")
        elif return_rate < 0.05:
            strengths.append("low_return_rate")
    if "rating" in df.columns:
        avg_rating = float(df["rating"].mean())
        if avg_rating >= 4.5:
            strengths.append("excellent_ratings")
        elif avg_rating < 3.5:
            risk_flags.append("low_ratings")
    if digital_pct >= 50:
        strengths.append("strong_digital_adoption")
    elif digital_pct < 20:
        risk_flags.append("cash_dependent")

    profile = {
        "business_type": business_type,
        "scale_tier": tier_bn if lang == "bn" else tier_en,
        "category_mix": category_mix,
        "digital_payment_pct": digital_pct,
        "top_city": top_city,
        "city_concentration_pct": city_concentration_pct,
        "risk_flags": risk_flags,
        "strengths": strengths,
    }
    profile["summary"] = _profile_summary(profile, tier_en)
    return profile


def _profile_summary(profile: dict, tier_en: str) -> str:
    """Compact English summary used to condition the LLM prompt."""
    parts = [
        f"This is a {tier_en}-scale, {profile['business_type']} merchant.",
        f"{profile['digital_payment_pct']}% of orders use digital payments.",
    ]
    if profile["top_city"]:
        parts.append(
            f"{profile['city_concentration_pct']}% of customers are in {profile['top_city']}."
        )
    if profile["risk_flags"]:
        parts.append("Known risks: " + ", ".join(profile["risk_flags"]) + ".")
    if profile["strengths"]:
        parts.append("Strengths: " + ", ".join(profile["strengths"]) + ".")
    parts.append("Tailor every recommendation to this specific merchant profile.")
    return " ".join(parts)
