"""
Market Intelligence Service — live real-world data ingestion.

Pulls two external signals and parses them into structured context that
grounds the AI recommendations in what is happening *outside* the merchant's
own spreadsheet:

1. USD→BDT exchange rate (open.er-api.com, free JSON API) — import-cost
   pressure signal, most relevant for electronics/imported goods pricing.
2. Bangladesh business headlines (Google News RSS, parsed with stdlib XML) —
   live market-context awareness surfaced to the merchant.

Both fetches are cached in-memory with a TTL and degrade gracefully: if the
outside world is unreachable, the rest of the analysis pipeline is unaffected
and the response simply marks the signal as unavailable. Uses only the Python
standard library — no new dependencies, no startup cost.
"""

import json
import time
import urllib.request
import xml.etree.ElementTree as ET

_FETCH_TIMEOUT_SECONDS = 5
_CACHE_TTL_SECONDS = 3600  # market signals don't need to be fresher than hourly

_cache: dict[str, dict] = {}  # key -> {"data": ..., "fetched_at": epoch}

_NEWS_RSS_URL = (
    "https://news.google.com/rss/search"
    "?q=bangladesh+business+OR+e-commerce+OR+SME&hl=en-BD&gl=BD&ceid=BD:en"
)
_FX_URL = "https://open.er-api.com/v6/latest/USD"


def _get_cached(key: str):
    entry = _cache.get(key)
    if entry and (time.time() - entry["fetched_at"]) < _CACHE_TTL_SECONDS:
        return entry["data"]
    return None


def _set_cached(key: str, data):
    _cache[key] = {"data": data, "fetched_at": time.time()}


def _http_get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "ByapariAI/1.0"})
    with urllib.request.urlopen(request, timeout=_FETCH_TIMEOUT_SECONDS) as response:
        return response.read()


# ── signal 1: exchange rate ─────────────────────────────────────────

def fetch_exchange_rate() -> dict:
    cached = _get_cached("fx")
    if cached:
        return cached
    try:
        payload = json.loads(_http_get(_FX_URL))
        rate = payload["rates"]["BDT"]
        data = {
            "available": True,
            "usd_bdt": round(float(rate), 2),
            "source": "open.er-api.com",
            "fetched_at": time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime()),
        }
        _set_cached("fx", data)
        return data
    except Exception:
        return {"available": False}


# ── signal 2: business headlines (RSS scrape + parse) ───────────────

def fetch_business_headlines(limit: int = 5) -> dict:
    cached = _get_cached("news")
    if cached:
        return cached
    try:
        root = ET.fromstring(_http_get(_NEWS_RSS_URL))
        items = []
        for item in root.iter("item"):
            title = item.findtext("title", default="").strip()
            link = item.findtext("link", default="").strip()
            pub_date = item.findtext("pubDate", default="").strip()
            if title:
                items.append({"title": title, "link": link, "published": pub_date})
            if len(items) >= limit:
                break
        data = {"available": bool(items), "headlines": items, "source": "Google News RSS (Bangladesh)"}
        _set_cached("news", data)
        return data
    except Exception:
        return {"available": False, "headlines": []}


# ── public API ──────────────────────────────────────────────────────

def get_market_signals() -> dict:
    """All external market signals, each independently fault-tolerant."""
    return {
        "exchange_rate": fetch_exchange_rate(),
        "news": fetch_business_headlines(),
    }


def build_market_context(signals: dict, top_category: str = "") -> str:
    """Compact natural-language market context for the LLM prompt."""
    parts = []
    fx = signals.get("exchange_rate", {})
    if fx.get("available"):
        parts.append(
            f"Current USD/BDT exchange rate: {fx['usd_bdt']} taka per dollar. "
            "A weaker taka raises import costs — relevant for imported goods pricing"
            + (f" such as {top_category}." if top_category else ".")
        )
    news = signals.get("news", {})
    if news.get("available"):
        titles = "; ".join(h["title"] for h in news["headlines"][:3])
        parts.append(f"Recent Bangladesh market headlines: {titles}")
    return "\n".join(parts)
