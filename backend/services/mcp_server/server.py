import os
import httpx
from mcp.server.fastmcp import FastMCP

CATALOG_URL = os.getenv("CATALOG_URL", "http://localhost:8000")

mcp = FastMCP("Agent Passport Catalog MCP")

@mcp.tool()
def search_catalog(query: str) -> str:
    """Search the merchant catalog by name or category."""
    response = httpx.post(f"{CATALOG_URL}/catalog/search", json={"query": query})
    if response.status_code == 200:
        items = response.json()
        if not items:
            return "No items found matching the query."
        res = "Catalog Items:\n"
        for item in items:
            res += f"- {item['name']} (SKU: {item['sku']}) | Price: {item['price_paise']/100} INR | Stock: {item['stock']}\n"
        return res
    return f"Error searching catalog: {response.text}"

@mcp.tool()
def get_item(sku: str) -> str:
    """Get details for a specific catalog item by SKU."""
    response = httpx.post(f"{CATALOG_URL}/catalog/get_item", params={"sku": sku})
    if response.status_code == 200:
        return str(response.json())
    return f"Error getting item: {response.text}"

@mcp.tool()
def negotiate(sku: str, requested_discount_pct: float, agent_id: str) -> str:
    """Propose a discount percentage for a specific SKU."""
    response = httpx.post(f"{CATALOG_URL}/catalog/negotiate", json={
        "sku": sku,
        "requested_discount_pct": requested_discount_pct,
        "agent_id": agent_id
    })
    if response.status_code == 200:
        verdict = response.json()
        return f"Negotiation Verdict: {verdict['decision'].upper()}\nReason: {verdict['reason']}\nCounter Offer: {verdict.get('counter_offer')}"
    return f"Error negotiating: {response.text}"

from typing import Any

@mcp.tool()
def propose_order(items: list[dict[str, Any]], requested_discount_pct: float, agent_id: str) -> str:
    """Propose a complete order. items should be a list of dictionaries with 'sku' (str) and 'qty' (int)."""
    intent = {
        "intent_id": "test-intent-" + agent_id,
        "agent_id": agent_id,
        "agent_name": "MCP Demo Agent",
        "items": items,
        "requested_discount_pct": requested_discount_pct,
        "cart_value_paise": 0,
        "timestamp": "2026-08-22T00:00:00"
    }
    response = httpx.post(f"{CATALOG_URL}/catalog/propose_order", json=intent)
    if response.status_code == 200:
        verdict = response.json()
        return f"Order Proposal Verdict: {verdict['decision'].upper()}\nReason: {verdict['reason']}"
    return f"Error proposing order: {response.text}"

if __name__ == "__main__":
    mcp.run(transport="stdio")
