import requests
import random
from datetime import datetime, timedelta

# Generate 90 days of realistic data
sample_data = []
base_date = datetime(2024, 1, 1)

for i in range(90):
    date = base_date + timedelta(days=i)
    day_of_week = date.weekday()
    weekend_boost = 1.4 if day_of_week >= 5 else 1.0
    trend = 1 + (i * 0.005)
    season = 1 + 0.3 * (1 if date.month in [11, 12, 1] else 0)
    noise = random.uniform(0.7, 1.3)
    
    sales = round(5000 * weekend_boost * trend * season * noise, 2)
    
    sample_data.append({
        'date': date.strftime('%Y-%m-%d'),
        'product_name': random.choice(['Football', 'Power Bank', 'Headphones', 'T-Shirt', 'Watch']),
        'product_category': random.choice(['Sports', 'Electronics', 'Clothing']),
        'sales': sales,
        'profit': round(sales * random.uniform(0.15, 0.25), 2),
        'quantity': random.randint(1, 10),
        'rating': round(random.uniform(3.0, 5.0), 1),
        'returned': 'No' if random.random() > 0.15 else 'Yes',
        'stock': random.randint(5, 200),
        'payment_method': random.choice(['bKash', 'Nagad', 'Cash', 'Card']),
        'customer_city': random.choice(['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'])
    })

response = requests.post('http://localhost:8000/api/ai-insights', 
    json={'csv_data': sample_data, 'lang': 'bn'})
    
result = response.json()

print("=== RAG RECOMMENDATIONS ===")
if 'rag_recommendations' in result:
    for tip in result['rag_recommendations']:
        print(f"[{tip['category']}] {tip['text'][:80]}...")
else:
    print("NO RAG FOUND!")

print("\n=== AI SUMMARY (first 200 chars) ===")
print(result.get('ai_summary', 'NO SUMMARY')[:200])