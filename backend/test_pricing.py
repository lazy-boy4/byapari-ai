import requests
import random
from datetime import datetime, timedelta

# Generate test data with CLEARLY DIFFERENT product profiles
base_date = datetime(2024, 1, 1)
sample_data = []

# Product profiles designed to trigger different pricing rules
products = [
    {
        "name": "DeadStock_Camera", 
        "stock": 200,      # HIGH stock
        "base_sales": 100, # LOW sales → dead stock
        "returns": 0.05,
        "rating": 3.5
    },
    {
        "name": "Hot_Phone", 
        "stock": 8,        # LOW stock
        "base_sales": 8000, # HIGH sales
        "returns": 0.02,
        "rating": 4.7
    },
    {
        "name": "Bad_Tablet", 
        "stock": 60, 
        "base_sales": 3000,
        "returns": 0.30,   # HIGH returns
        "rating": 2.8
    },
    {
        "name": "Premium_Watch", 
        "stock": 40, 
        "base_sales": 5000,
        "returns": 0.01,   # LOW returns
        "rating": 4.9      # HIGH rating
    },
]

for i in range(60):
    date = base_date + timedelta(days=i)
    for prod in products:
        # Consistent sales pattern per product
        sales = prod["base_sales"] * random.uniform(0.9, 1.1)
        
        sample_data.append({
            'date': date.strftime('%Y-%m-%d'),
            'product_name': prod["name"],
            'product_category': 'Electronics',
            'sales': round(sales, 2),
            'profit': round(sales * 0.18, 2),
            'quantity': random.randint(1, 5),
            'rating': prod["rating"],
            'returned': 'Yes' if random.random() < prod["returns"] else 'No',
            'stock': prod["stock"],
            'payment_method': 'bKash',
            'customer_city': 'Dhaka'
        })

print(f"Generated {len(sample_data)} rows for {len(products)} products")

response = requests.post('http://localhost:8000/api/pricing-suggestions', 
    json={'csv_data': sample_data, 'lang': 'bn'})

result = response.json()

print("\n=== PRICING SUMMARY ===")
print(f"Total opportunities: {result['summary']['total_opportunities']}")
print(f"Revenue at risk: ৳{result['summary']['revenue_at_risk']}")
print(f"Potential uplift: ৳{result['summary']['potential_uplift']}")

print("\n=== SUGGESTIONS ===")
for s in result['suggestions']:
    print(f"\n🎯 {s['product']}")
    print(f"   Suggestion type: {s['suggestion']}")
    print(f"   Reason: {s['reason']}")
    print(f"   Display: {s['display_text'][:80]}")
    print(f"   Priority: {s['priority']}")
    print(f"   Price change: {s['price_change_percent']}%")
    print(f"   Velocity: {s['current_metrics']['velocity']}")
    print(f"   Stock days: {s['current_metrics']['stock_days_remaining']}")
    print(f"   Return rate: {s['current_metrics']['return_rate']}")