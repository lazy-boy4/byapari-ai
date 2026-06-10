from groq import Groq
import os

api_key = os.environ.get("GROQ_API_KEY") or "DUMMY_KEY"
client = Groq(api_key=api_key)

def generate_ai_analysis(
    kpis: dict,
    insights: list,
    lang: str = "bn",
    rag_context: str = "",
    graph_facts: str = "",
    market_context: str = "",
    profile_summary: str = "",
) -> str:

    lang_instruction = (
        "Respond in Bengali (বাংলা) language only."
        if lang == "bn"
        else "Respond in English."
    )

    # Build RAG-enhanced prompt
    rag_section = ""
    if rag_context:
        rag_section = f"""
Relevant business knowledge from our database:
{rag_context}

Use these insights to make your recommendations more specific and actionable.
Reference specific tips when relevant.
"""

    graph_section = ""
    if graph_facts:
        graph_section = f"""
Facts derived from this merchant's knowledge graph (relationships between
products, categories, cities, and payment methods in their own data):
{graph_facts}

Ground your recommendations in these relationships where relevant.
"""

    market_section = ""
    if market_context:
        market_section = f"""
Live market context (real-world signals fetched today):
{market_context}
"""

    profile_section = ""
    if profile_summary:
        profile_section = f"""
Merchant profile (personalize your advice to this):
{profile_summary}
"""

    prompt = f"""
You are a business analyst AI for Bangladeshi merchants.

{lang_instruction}

Here is the business data:
- Total Sales: {kpis.get('total_sales', 0)}
- Total Orders: {kpis.get('total_orders', 0)}
- Total Profit: {kpis.get('total_profit', 0)}
- Average Rating: {kpis.get('average_rating', 0)}
- Returned Orders: {kpis.get('returned_orders', 0)}
- Top Category: {kpis.get('top_category', 'N/A')}
- Low Stock Products: {kpis.get('low_stock_products', 0)}

Key findings:
{chr(10).join([f"- {i['title']}: {i['message']}" for i in insights])}

{profile_section}
{graph_section}
{market_section}
{rag_section}

Give 3-4 specific actionable business recommendations.
Be practical and encouraging. Under 200 words.
"""

    # llama-3.3-70b writes noticeably better Bengali; fall back to the
    # smaller instant model if the 70b is rate-limited or unavailable.
    last_error = None
    for model in ("llama-3.3-70b-versatile", "llama-3.1-8b-instant"):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
            )
            return response.choices[0].message.content
        except Exception as e:
            last_error = e

    error_msg = str(last_error)

    # ── Quota exceeded ──
    if "429" in error_msg or "quota" in error_msg.lower() or "rate" in error_msg.lower():
        if lang == "bn":
            return "⚠️ এআই বিশ্লেষণ সাময়িকভাবে অনুপলব্ধ। আপনার ডেটা সফলভাবে বিশ্লেষণ করা হয়েছে — উপরের KPI এবং ইনসাইট দেখুন।"
        return "⚠️ AI analysis temporarily unavailable due to rate limits. Your data was analyzed successfully — please check the KPIs and insights above."

    # ── Invalid API key ──
    if "401" in error_msg or "invalid" in error_msg.lower():
        if lang == "bn":
            return "⚠️ এআই সংযোগে সমস্যা হয়েছে। এপিআই কী যাচাই করুন।"
        return "⚠️ AI connection failed. Please check the API key."

    # ── Any other error ──
    if lang == "bn":
        return "⚠️ এআই বিশ্লেষণ এই মুহূর্তে উপলব্ধ নেই। উপরের ইনসাইটগুলো দেখুন।"
    return "⚠️ AI analysis not available right now. Please check the insights above."