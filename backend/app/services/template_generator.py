"""Formats insights into card format for frontend display"""


def format_insight_card(insight: str, index: int) -> dict:
    """Convert insight text to card format with severity"""

    # Determine severity by emoji
    if "⚠️" in insight or "📉" in insight or "🚨" in insight:
        severity = "high"
    elif "🚀" in insight or "🏆" in insight or "⭐" in insight or "✅" in insight:
        severity = "normal"
    else:
        severity = "info"

    # Extract emoji
    icon = insight.split(" ")[0] if insight else "💡"

    return {
        "id": index,
        "text": insight,
        "icon": icon,
        "severity": severity
    }
