import json
import uuid
import os
import httpx
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from contracts.schema import CatalogItem, OrderIntent, FirewallVerdict, OrderItem

app = FastAPI(title="Catalog Service")

FIREWALL_URL = os.getenv("FIREWALL_URL", "http://localhost:8001")
AUDIT_URL = os.getenv("AUDIT_URL", "http://localhost:8002")

def load_catalog() -> List[CatalogItem]:
    catalog_path = os.path.join(os.path.dirname(__file__), '../../seed/merchant_catalog.json')
    with open(catalog_path, 'r') as f:
        data = json.load(f)
        return [CatalogItem(**item) for item in data]

catalog_items = load_catalog()

def evaluate_firewall(intent_data: dict) -> dict:
    policy_path = os.path.join(os.path.dirname(__file__), '../../seed/policy_config.json')
    with open(policy_path, 'r') as f:
        policy = json.load(f)
    
    req = {
        "intent": intent_data,
        "policy": policy,
        "commit_spend": False
    }
    res = httpx.post(f"{FIREWALL_URL}/firewall/evaluate", json=req)
    if res.status_code == 200:
        return res.json()
    raise HTTPException(status_code=500, detail=f"Firewall evaluation failed: {res.text}")

def write_audit(action: str, agent_id: str, input_summary: str, intent_id: str, verdict: dict = None):
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "intent_id": intent_id,
        "agent_id": agent_id,
        "action": action,
        "input_summary": input_summary,
        "verdict": verdict,
        "razorpay_order_id": None,
        "razorpay_status": None
    }
    try:
        httpx.post(f"{AUDIT_URL}/audit/write", json=entry)
    except Exception as e:
        print(f"Failed to write audit: {e}")

class SearchRequest(BaseModel):
    query: str

class NegotiateRequest(BaseModel):
    sku: str
    requested_discount_pct: float
    agent_id: str

@app.post("/catalog/search", response_model=List[CatalogItem])
def search_catalog(req: SearchRequest):
    query = req.query.lower()
    results = [item for item in catalog_items if query in item.name.lower() or query in item.category.lower()]
    
    write_audit("query", "unknown", f"Searched for '{req.query}'", str(uuid.uuid4()))
    return results

@app.post("/catalog/get_item", response_model=CatalogItem)
def get_item(sku: str):
    for item in catalog_items:
        if item.sku == sku:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/catalog/negotiate", response_model=FirewallVerdict)
def negotiate(req: NegotiateRequest):
    item = next((c for c in catalog_items if c.sku == req.sku), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    intent_id = str(uuid.uuid4())
    intent_data = {
        "intent_id": intent_id,
        "agent_id": req.agent_id,
        "agent_name": "unknown",
        "items": [{"sku": req.sku, "qty": 1}],
        "requested_discount_pct": req.requested_discount_pct,
        "cart_value_paise": item.price_paise,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    verdict = evaluate_firewall(intent_data)
    write_audit("negotiate", req.agent_id, f"Negotiating {req.requested_discount_pct}% on {req.sku}", intent_id, verdict)
    return verdict

@app.post("/catalog/propose_order", response_model=FirewallVerdict)
def propose_order(intent: OrderIntent):
    verdict = evaluate_firewall(intent.model_dump())
    write_audit("order_intent", intent.agent_id, f"Proposing order for {len(intent.items)} items", intent.intent_id, verdict)
    return verdict

