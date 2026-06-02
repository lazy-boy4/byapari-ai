from groq import Groq
import os

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_ai_analysis(kpis: dict, insights: list, lang: str = "bn", rag_context: str = "") -> str:
    
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

{rag_section}

Give 3-4 specific actionable business recommendations.
Be practical and encouraging. Under 200 words.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
        )
        return response.choices[0].message.content

    except Exception as e:
        error_msg = str(e)

        # ── Quota exceeded ──
        if "429" in error_msg or "quota" in error_msg.lower() or "rate" in error_msg.lower():
            if lang == "bn":
                return "⚠️ এআই বিশ্লেষণ সাময়িকভাবে অনুপলব্ধ। আপনার ডেটা সফলভাবে বিশ্লেষণ করা হয়েছে — উপরের KPI এবং ইনসাইট দেখুন।"
            return "⚠️ AI analysis temporarily unavailable due to rate limits. Your data was analyzed successfully — please check the KPIs and insights above."

        # ── Invalid API key ──
        elif "401" in error_msg or "invalid" in error_msg.lower():
            if lang == "bn":
                return "⚠️ এআই সংযোগে সমস্যা হয়েছে। এপিআই কী যাচাই করুন।"
            return "⚠️ AI connection failed. Please check the API key."

        # ── Any other error ──
        else:
            if lang == "bn":
                return "⚠️ এআই বিশ্লেষণ এই মুহূর্তে উপলব্ধ নেই। উপরের ইনসাইটগুলো দেখুন।"
            return "⚠️ AI analysis not available right now. Please check the insights above."