"""
Merchant Knowledge Graph — lightweight graph-based reasoning over sales data.

Builds an in-memory typed graph from the merchant's uploaded CSV:

    (Product) --belongs_to--> (Category)
    (Product) --sold_in-----> (City)        [weight = revenue]
    (Product) <--co_demand--> (Product)     [weight = co-occurrence strength]
    (Category) --paid_via---> (PaymentMethod)

and runs reasoning queries over it (cross-sell bundles, city expansion
opportunities, payment-behaviour correlations). Pure Python — no external
graph database required, so it starts instantly on free-tier hosting and
scales per-request with the stateless architecture.

The graph's findings are returned to the UI as `graph_insights` and are also
serialized to natural-language facts that ground the LLM prompt (GraphRAG).
"""

from collections import defaultdict
from itertools import combinations

import pandas as pd


def _safe_str(value) -> str:
    return str(value).strip() if value is not None and str(value).strip() else "Unknown"


class MerchantKnowledgeGraph:
    def __init__(self):
        self.nodes: dict[str, dict] = {}          # node_id -> {type, label, attrs}
        self.edges: dict[tuple, dict] = {}         # (src, dst, kind) -> {weight, attrs}

    # ── construction ────────────────────────────────────────────────

    def _add_node(self, node_id: str, node_type: str, **attrs):
        if node_id not in self.nodes:
            self.nodes[node_id] = {"type": node_type, "label": node_id.split("::", 1)[-1], **attrs}

    def _add_edge(self, src: str, dst: str, kind: str, weight: float = 1.0):
        key = (src, dst, kind)
        if key in self.edges:
            self.edges[key]["weight"] += weight
        else:
            self.edges[key] = {"weight": weight}

    @classmethod
    def from_dataframe(cls, df: pd.DataFrame) -> "MerchantKnowledgeGraph":
        g = cls()

        has_product = "product_name" in df.columns
        has_category = "product_category" in df.columns
        has_city = "customer_city" in df.columns
        has_payment = "payment_method" in df.columns

        for _, row in df.iterrows():
            sales = float(row.get("sales", 0) or 0)

            product = _safe_str(row.get("product_name")) if has_product else None
            category = _safe_str(row.get("product_category")) if has_category else None
            city = _safe_str(row.get("customer_city")) if has_city else None
            payment = _safe_str(row.get("payment_method")) if has_payment else None

            if product:
                g._add_node(f"product::{product}", "product")
            if category:
                g._add_node(f"category::{category}", "category")
            if city:
                g._add_node(f"city::{city}", "city")
            if payment:
                g._add_node(f"payment::{payment}", "payment")

            if product and category:
                g._add_edge(f"product::{product}", f"category::{category}", "belongs_to")
            if product and city:
                g._add_edge(f"product::{product}", f"city::{city}", "sold_in", weight=sales)
            if category and city:
                g._add_edge(f"category::{category}", f"city::{city}", "demanded_in", weight=sales)
            if category and payment:
                g._add_edge(f"category::{category}", f"payment::{payment}", "paid_via")

        # Co-demand edges: products bought in the same city around the same
        # time are treated as a basket proxy (the CSV has no order ids).
        if has_product and has_city and "date" in df.columns:
            df = df.copy()
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            df = df[df["date"].notna()]
            df["week"] = df["date"].dt.to_period("W").astype(str)
            for (_, _), group in df.groupby(["customer_city", "week"]):
                products = sorted({_safe_str(p) for p in group["product_name"]})
                for a, b in combinations(products, 2):
                    g._add_edge(f"product::{a}", f"product::{b}", "co_demand")

        return g

    # ── reasoning queries ───────────────────────────────────────────

    def cross_sell_pairs(self, top_n: int = 3) -> list[dict]:
        """Strongest co-demand product pairs → bundle/cross-sell candidates."""
        pairs = [
            {"product_a": self.nodes[s]["label"], "product_b": self.nodes[d]["label"],
             "strength": round(e["weight"], 1)}
            for (s, d, kind), e in self.edges.items()
            if kind == "co_demand"
        ]
        return sorted(pairs, key=lambda p: p["strength"], reverse=True)[:top_n]

    def city_opportunities(self, top_n: int = 3) -> list[dict]:
        """Categories that sell well overall but are under-represented in a
        merchant's strong cities → expansion opportunities."""
        category_total: dict[str, float] = defaultdict(float)
        city_total: dict[str, float] = defaultdict(float)
        category_in_city: dict[tuple, float] = defaultdict(float)

        for (s, d, kind), e in self.edges.items():
            if kind == "demanded_in":
                cat, city = self.nodes[s]["label"], self.nodes[d]["label"]
                category_total[cat] += e["weight"]
                city_total[city] += e["weight"]
                category_in_city[(cat, city)] += e["weight"]

        if not category_total or not city_total:
            return []

        grand_total = sum(category_total.values()) or 1.0
        opportunities = []
        top_cities = sorted(city_total, key=city_total.get, reverse=True)[:3]
        for city in top_cities:
            for cat, cat_sales in category_total.items():
                global_share = cat_sales / grand_total
                local_share = category_in_city.get((cat, city), 0.0) / (city_total[city] or 1.0)
                gap = global_share - local_share
                if gap > 0.05:  # category clearly under-indexed in this city
                    opportunities.append({
                        "city": city,
                        "category": cat,
                        "global_share_pct": round(global_share * 100, 1),
                        "local_share_pct": round(local_share * 100, 1),
                        "gap_pct": round(gap * 100, 1),
                    })
        return sorted(opportunities, key=lambda o: o["gap_pct"], reverse=True)[:top_n]

    def payment_preferences(self) -> list[dict]:
        """Which payment methods dominate each category — informs offers
        (e.g. bKash cashback where digital adoption is already high)."""
        by_category: dict[str, dict[str, float]] = defaultdict(dict)
        for (s, d, kind), e in self.edges.items():
            if kind == "paid_via":
                cat, pay = self.nodes[s]["label"], self.nodes[d]["label"]
                by_category[cat][pay] = by_category[cat].get(pay, 0) + e["weight"]
        results = []
        for cat, payments in by_category.items():
            total = sum(payments.values()) or 1.0
            top_pay = max(payments, key=payments.get)
            results.append({
                "category": cat,
                "top_payment_method": top_pay,
                "share_pct": round(payments[top_pay] / total * 100, 1),
            })
        return sorted(results, key=lambda r: r["share_pct"], reverse=True)

    def stats(self) -> dict:
        return {
            "nodes": len(self.nodes),
            "edges": len(self.edges),
            "node_types": {
                t: sum(1 for n in self.nodes.values() if n["type"] == t)
                for t in ("product", "category", "city", "payment")
            },
        }


# ── public API ──────────────────────────────────────────────────────

def build_graph_insights(df: pd.DataFrame, lang: str = "en") -> dict:
    """Build the knowledge graph and return UI-ready reasoning results plus
    natural-language facts for grounding the LLM (GraphRAG)."""
    graph = MerchantKnowledgeGraph.from_dataframe(df)

    cross_sell = graph.cross_sell_pairs()
    opportunities = graph.city_opportunities()
    payments = graph.payment_preferences()[:3]

    facts: list[str] = []
    recommendations: list[dict] = []

    for pair in cross_sell:
        facts.append(
            f"Customers who buy '{pair['product_a']}' often also buy "
            f"'{pair['product_b']}' (co-demand strength {pair['strength']})."
        )
        if lang == "bn":
            msg = (f"'{pair['product_a']}' এবং '{pair['product_b']}' প্রায়ই একসাথে বিক্রি হয় — "
                   f"বান্ডেল অফার করলে গড় অর্ডার ভ্যালু বাড়বে।")
            title = "🔗 বান্ডেল সুযোগ"
        else:
            msg = (f"'{pair['product_a']}' and '{pair['product_b']}' frequently sell together — "
                   f"offer them as a bundle to raise average order value.")
            title = "🔗 Bundle Opportunity"
        recommendations.append({"type": "growth", "title": title, "message": msg,
                                "priority": "medium", "confidence": 88, "source": "knowledge_graph"})

    for opp in opportunities:
        facts.append(
            f"Category '{opp['category']}' makes up {opp['global_share_pct']}% of overall revenue "
            f"but only {opp['local_share_pct']}% in {opp['city']} — an under-served market."
        )
        if lang == "bn":
            msg = (f"'{opp['category']}' সারা দেশে আপনার বিক্রয়ের {opp['global_share_pct']}% "
                   f"কিন্তু {opp['city']}-তে মাত্র {opp['local_share_pct']}% — এই শহরে "
                   f"টার্গেটেড মার্কেটিং করুন।")
            title = "🗺️ শহরভিত্তিক সুযোগ"
        else:
            msg = (f"'{opp['category']}' is {opp['global_share_pct']}% of your overall revenue but only "
                   f"{opp['local_share_pct']}% in {opp['city']} — run targeted marketing there.")
            title = "🗺️ City Expansion Opportunity"
        recommendations.append({"type": "growth", "title": title, "message": msg,
                                "priority": "medium", "confidence": 85, "source": "knowledge_graph"})

    for pay in payments:
        facts.append(
            f"In category '{pay['category']}', {pay['share_pct']}% of orders use "
            f"{pay['top_payment_method']}."
        )

    return {
        "graph_stats": graph.stats(),
        "cross_sell": cross_sell,
        "city_opportunities": opportunities,
        "payment_preferences": payments,
        "recommendations": recommendations,
        "facts": facts,
    }
