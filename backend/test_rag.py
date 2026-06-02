from app.services.rag_service import knowledge_base

# Test 1: Query for electronics pricing
print("=== Test 1: Electronics pricing ===")
tips = knowledge_base.query("electronics high price eid festival", n_results=3)
for tip in tips:
    print(f"  [{tip['category']}] {tip['text'][:60]}... (relevance: {tip['relevance']})")

# Test 2: Query for inventory
print("\n=== Test 2: Inventory management ===")
tips = knowledge_base.query("stock low monsoon damage", n_results=3)
for tip in tips:
    print(f"  [{tip['category']}] {tip['text'][:60]}...")

# Test 3: Query for customer service
print("\n=== Test 3: Customer complaints ===")
tips = knowledge_base.query("customer angry return policy", n_results=3)
for tip in tips:
    print(f"  [{tip['category']}] {tip['text'][:60]}...")
    