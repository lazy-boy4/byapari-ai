import chromadb
from chromadb.utils import embedding_functions
import os

# =========================================================
# BENGALI BUSINESS KNOWLEDGE BASE
# =========================================================

BENGALI_BUSINESS_TIPS = [
    # Pricing
    {"id": "price_1", "text": "ঈদের আগে ইলেকট্রনিক্স পণ্যের চাহিদা ৩০-৪০% বাড়ে, দাম ১০-১৫% বাড়ানো যায়", "category": "pricing", "tags": ["eid", "electronics", "seasonal"]},
    {"id": "price_2", "text": "বিকাশ পেমেন্টে ১৫% ডিসকাউন্ট দিলে কনভারশন রেট ২৫% বাড়ে", "category": "pricing", "tags": ["bkash", "discount", "conversion"]},
    {"id": "price_3", "text": "নতুন পণ্য লঞ্চের প্রথম সপ্তাহে ২০% ডিসকাউন্ট দিলে ভালো রিভিউ পাওয়া যায়", "category": "pricing", "tags": ["launch", "discount", "review"]},
    {"id": "price_4", "text": "পুরাতন স্টক clearance-এ ৩০-৫০% ডিসকাউন্ট দিন, লাভ কম হলেও ক্যাশ ফ্লো বাড়ে", "category": "pricing", "tags": ["clearance", "cashflow"]},
    {"id": "price_5", "text": "পাইকারি ক্রেতাকে ১০% অতিরিক্ত ডিসকাউন্ট দিলে বড় অর্ডার পাওয়া যায়", "category": "pricing", "tags": ["wholesale", "bulk"]},
    
    # Inventory
    {"id": "inv_1", "text": "ফাস্ট মুভিং আইটেমের স্টক সবসময় ৩০ দিনের বিক্রয় মাত্রায় রাখুন", "category": "inventory", "tags": ["stock", "fast-moving"]},
    {"id": "inv_2", "text": "রমজান মাসে খাদ্য পণ্যের স্টক ২ গুণ বাড়ান, নাহলে stockout হবে", "category": "inventory", "tags": ["ramadan", "food", "stockout"]},
    {"id": "inv_3", "text": "স্টক ৬০ দিনের বেশি পুরাতন হলে clearance sale করুন, নাহলে dead stock হয়ে যাবে", "category": "inventory", "tags": ["dead-stock", "clearance"]},
    {"id": "inv_4", "text": "সাপ্লায়ারকে ৪৫ দিনের payment term নেগোশিয়েট করুন, ক্যাশ ফ্লো ভালো থাকবে", "category": "inventory", "tags": ["supplier", "cashflow"]},
    {"id": "inv_5", "text": "বর্ষাকালে ইলেকট্রনিক্স পণ্যের স্টক কম রাখুন, আর্দ্রতায় ক্ষতি হতে পারে", "category": "inventory", "tags": ["monsoon", "electronics"]},
    
    # Customer Service
    {"id": "cs_1", "text": "গ্রাহকের অভিযোগ ২৪ ঘন্টার মধ্যে সমাধান করলে ৮০% গ্রাহক আবার কিনবে", "category": "customer", "tags": ["complaint", "retention"]},
    {"id": "cs_2", "text": "প্রতিটি অর্ডারের সাথে ছোট গিফট দিলে রিভিউ রেট ৩ গুণ বাড়ে", "category": "customer", "tags": ["gift", "review"]},
    {"id": "cs_3", "text": "WhatsApp-এ অর্ডার আপডেট দিলে গ্রাহক সন্তুষ্টি ৪০% বাড়ে", "category": "customer", "tags": ["whatsapp", "communication"]},
    {"id": "cs_4", "text": "রিটার্ন পলিসি ৭ দিনের বেশি না দিলে ফ্রড কম হয়", "category": "customer", "tags": ["return", "fraud"]},
    {"id": "cs_5", "text": "ভিআইপি গ্রাহকদের জন্য আলাদা WhatsApp গ্রুপ করুন, লয়্যালটি বাড়বে", "category": "customer", "tags": ["vip", "loyalty"]},
    
    # Marketing
    {"id": "mkt_1", "text": "Facebook Ads-এ 'Cash on Delivery' লিখলে ক্লিক রেট ৩৫% বাড়ে", "category": "marketing", "tags": ["facebook", "cod", "ads"]},
    {"id": "mkt_2", "text": "ইনফ্লুয়েন্সার মার্কেটিং-এ micro-influencer (১০কে-৫০কে ফলোয়ার) বেশি ROI দেয়", "category": "marketing", "tags": ["influencer", "roi"]},
    {"id": "mkt_3", "text": "প্রতি শুক্রবার নতুন অফার দিলে গ্রাহক অপেক্ষা করে, সেল বাড়ে", "category": "marketing", "tags": ["friday", "offer"]},
    {"id": "mkt_4", "text": "YouTube Shorts-এ পণ্য রিভিউ দিলে young audience পাওয়া যায়", "category": "marketing", "tags": ["youtube", "shorts"]},
    {"id": "mkt_5", "text": "Referral program-এ ৫০ টাকা বোনাস দিলে word-of-mouth বাড়ে", "category": "marketing", "tags": ["referral", "bonus"]},
    
    # Seasonal
    {"id": "sea_1", "text": "বৈশাখে নতুন পোশাকের চাহিদা সর্বোচ্চ, স্টক ৩ মাস আগে রেডি রাখুন", "category": "seasonal", "tags": ["boishakh", "clothing"]},
    {"id": "sea_2", "text": "পূজার সময় গহনা ও পোশাকের বিক্রয় ২০০% বাড়ে", "category": "seasonal", "tags": ["puja", "jewelry"]},
    {"id": "sea_3", "text": "শীতকালে হিটার ও কম্বলের চাহিদা বাড়ে, গরমকালে ফ্যান", "category": "seasonal", "tags": ["winter", "summer"]},
    {"id": "sea_4", "text": "স্কুল reopening-এর আগে স্টেশনারি ও ব্যাগের স্টক বাড়ান", "category": "seasonal", "tags": ["school", "stationery"]},
    {"id": "sea_5", "text": "বিয়ের সিজনে (নভেম্বর-ফেব্রুয়ারি) গহনা ও কসমেটিক্স বেশি বিক্রি হয়", "category": "seasonal", "tags": ["wedding", "cosmetics"]},
    
    # Operations
    {"id": "ops_1", "text": "দিনে ৩ বার স্টক চেক করুন, সিস্টেম আর বাস্তবের পার্থক্য কমবে", "category": "operations", "tags": ["stock-check", "audit"]},
    {"id": "ops_2", "text": "ডেলিভারি বয়কে ইনসেন্টিভ দিলে অন-time ডেলিভারি ৬০% বাড়ে", "category": "operations", "tags": ["delivery", "incentive"]},
    {"id": "ops_3", "text": "পণ্য প্যাকেজিং-এ ব্র্যান্ড লোগো থাকলে repeat order ২৫% বাড়ে", "category": "operations", "tags": ["packaging", "branding"]},
    {"id": "ops_4", "text": "দোকানের সাজসজ্জা মাসে একবার বদলান, গ্রাহক আগ্রহ বাড়ে", "category": "operations", "tags": ["visual", "merchandising"]},
    {"id": "ops_5", "text": "কর্মচারীদের মাসিক বোনাস দিলে চুরি ও নষ্টি ৫০% কমে", "category": "operations", "tags": ["employee", "bonus"]},
    
    # Digital
    {"id": "dig_1", "text": "bKash merchant account-এ cashback offer দিলে digital payment ৪০% বাড়ে", "category": "digital", "tags": ["bkash", "cashback"]},
    {"id": "dig_2", "text": "Website-এ live chat bot থাকলে cart abandonment ২০% কমে", "category": "digital", "tags": ["chatbot", "cart"]},
    {"id": "dig_3", "text": "SMS marketing-এ ৮০% open rate, email-এ ২০%", "category": "digital", "tags": ["sms", "email"]},
    {"id": "dig_4", "text": "Google My Business listing থাকলে local search-এ দেখা যায়", "category": "digital", "tags": ["google", "local"]},
    {"id": "dig_5", "text": "QR code payment দিলে checkout time ৫০% কমে", "category": "digital", "tags": ["qr", "payment"]},
]

# =========================================================
# RAG SERVICE
# =========================================================

class BusinessKnowledgeBase:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(
            name="business_tips",
            embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="paraphrase-multilingual-MiniLM-L12-v2"
            )
        )
        self._seed_data()
        self._initialized = True
        print("🔥 RAG Knowledge Base initialized with", len(BENGALI_BUSINESS_TIPS), "tips")
    
    def _seed_data(self):
        """Add all tips to vector store"""
        existing = self.collection.get()
        if existing and len(existing["ids"]) > 0:
            return  # Already seeded
        
        texts = [tip["text"] for tip in BENGALI_BUSINESS_TIPS]
        ids = [tip["id"] for tip in BENGALI_BUSINESS_TIPS]
        metadatas = [{"category": tip["category"], "tags": ",".join(tip["tags"])} for tip in BENGALI_BUSINESS_TIPS]
        
        self.collection.add(
            documents=texts,
            ids=ids,
            metadatas=metadatas
        )
        print(f"🔥 Seeded {len(texts)} business tips into ChromaDB")
    
    def query(self, business_context: str, n_results: int = 3):
        """
        Retrieve relevant business tips based on context.
        business_context: e.g., "electronics sales low stock eid"
        """
        results = self.collection.query(
            query_texts=[business_context],
            n_results=n_results
        )
        
        tips = []
        for i in range(len(results["ids"][0])):
            tips.append({
                "id": results["ids"][0][i],
                "text": results["documents"][0][i],
                "category": results["metadatas"][0][i]["category"],
                "relevance": round(float(results["distances"][0][i]), 3) if results["distances"] else None
            })
        
        return tips
    
    def get_by_category(self, category: str, n_results: int = 5):
        """Get tips by category"""
        results = self.collection.get(
            where={"category": category}
        )
        return results["documents"][:n_results] if results["documents"] else []

# Singleton instance
knowledge_base = BusinessKnowledgeBase()