import os
import uuid
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
from datetime import datetime, timezone

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from contracts.schema import OrderIntent, FirewallVerdict, AuditLogEntry

app = FastAPI(title="Payments Service")

AUDIT_URL = os.getenv("AUDIT_URL", "http://localhost:8002")

class CreateOrderRequest(BaseModel):
    intent: OrderIntent
    verdict: FirewallVerdict

def write_audit(entry: dict):
    try:
        httpx.post(f"{AUDIT_URL}/audit/write", json=entry)
    except Exception as e:
        print(f"Failed to write audit: {e}")

@app.post("/payments/create_order")
def create_order(req: CreateOrderRequest):
    if req.verdict.decision != "approved":
        raise HTTPException(status_code=400, detail="Order not approved by firewall")
        
    # Simulate Razorpay test mode order creation
    razorpay_order_id = f"order_test_{uuid.uuid4().hex[:12]}"
    payment_link = f"https://rzp.io/i/{uuid.uuid4().hex[:8]}"
    
    amount = req.verdict.final_value_paise
    
    # Audit logging for payment initiation
    audit_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "intent_id": req.intent.intent_id,
        "agent_id": req.intent.agent_id,
        "action": "payment",
        "input_summary": f"Initiated payment for {amount} paise",
        "verdict": req.verdict.model_dump(),
        "razorpay_order_id": razorpay_order_id,
        "razorpay_status": "created"
    }
    
    write_audit(audit_entry)
    
    return {
        "razorpay_order_id": razorpay_order_id,
        "payment_link": payment_link,
        "final_value_paise": amount
    }
