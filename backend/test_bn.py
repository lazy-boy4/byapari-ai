import requests
import json

sample_data = [
    {'date': '2024-01-01', 'product_name': 'Test', 'product_category': 'Electronics', 
     'sales': 1000, 'profit': 200, 'quantity': 2, 'rating': 4.5, 'returned': 'No',
     'stock': 50, 'payment_method': 'bKash', 'customer_city': 'Dhaka'}
] * 20

response = requests.post('http://localhost:8000/api/ai-insights', 
    json={'csv_data': sample_data, 'lang': 'bn'})
    
result = response.json()
print("Number of insights:", len(result['insights']))
print()
for insight in result['insights']:
    print(f"TITLE: {insight['title']}")
    print(f"MESSAGE: {insight['message'][:50]}...")
    print('---')