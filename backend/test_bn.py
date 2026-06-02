import requests
import random
from datetime import datetime, timedelta

# Generate 90 days of realistic data with variation
sample_data = []
base_date = datetime(2024, 1, 1)

for i in range(90):
    date = base_date + timedelta(days=i)
    
    # Weekend boost + trend + random noise
    day_of_week = date.weekday()
    weekend_boost = 1.4 if day_of_week >= 5 else 1.0
    trend = 1 + (i * 0.005)
    season = 1 + 0.3 * (1 if date.month in [11, 12, 1] else 0)  # Winter boost
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

print(f"Generated {len(sample_data)} rows")
print(f"Date range: {sample_data[0]['date']} to {sample_data[-1]['date']}")
print(f"Sales range: {min(r['sales'] for r in sample_data):.0f} to {max(r['sales'] for r in sample_data):.0f}")

response = requests.post('http://localhost:8000/api/ai-insights', 
    json={'csv_data': sample_data, 'lang': 'bn'})
    
result = response.json()

print("\n=== FORECAST ===")
if 'forecast' in result and len(result['forecast']) > 0:
    f = result['forecast'][0]
    print(f"Forecast keys: {list(f.keys())}")
    
    values = []
    for item in result['forecast']:
        pred = item.get('predicted_sales', item.get('yhat', 'N/A'))
        lower = item.get('lower_bound', item.get('yhat_lower', 'N/A'))
        upper = item.get('upper_bound', item.get('yhat_upper', 'N/A'))
        print(f"Date: {item['date']} | ৳{pred} | lower: ৳{lower} | upper: ৳{upper}")
        values.append(float(pred) if pred != 'N/A' else 0)
    
    if values:
        print(f"\nMin: {min(values):.0f} | Max: {max(values):.0f} | Diff: {max(values)-min(values):.0f}")
        if max(values) - min(values) > 500:
            print("✅ WAVY!")
        else:
            print("❌ FLAT")
else:
    print("NO FORECAST!")
    print(f"Keys in result: {list(result.keys())}")