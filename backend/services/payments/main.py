import os
import uuid
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import hmac
import hashlib
import sqlite3
from fastapi import FastAPI, HTTPException, Request
from datetime import datetime, timezone

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from contracts.schema import OrderIntent, FirewallVerdict, AuditLogEntry

app = FastAPI(title="Payments Service")

AUDIT_URL = os.getenv("AUDIT_URL", "http://localhost:8002")
FIREWALL_SECRET = os.getenv("FIREWALL_SECRET", "supersecret_firewall_key").encode()
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "whsec_dummy").encode()
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
DB_PATH = os.getenv("PAYMENTS_DB_PATH", os.path.join(os.path.dirname(__file__), "payments.db"))

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS idempotency_keys (
            intent_id TEXT PRIMARY KEY,
            razorpay_order_id TEXT,
            payment_link TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

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
    # 1. Cryptographic Zero-Trust Gating (Verify signature)
    intent_id = req.intent.intent_id
    decision = req.verdict.decision
    expected_sig = hmac.new(FIREWALL_SECRET, f"{intent_id}:{decision}".encode(), hashlib.sha256).hexdigest()
    
    if req.verdict.signature != expected_sig:
        raise HTTPException(status_code=403, detail="Untrusted verdict origin. Signature invalid.")

    if decision != "approved":
        raise HTTPException(status_code=400, detail="Order not approved by firewall")
        
    # 2. Idempotency Check
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT razorpay_order_id, payment_link FROM idempotency_keys WHERE intent_id = ?', (intent_id,))
    existing = cursor.fetchone()
    
    if existing:
        conn.close()
        return {
            "razorpay_order_id": existing[0],
            "payment_link": existing[1],
            "final_value_paise": req.verdict.final_value_paise,
            "idempotent_replay": True
        }
        
    amount = req.verdict.final_value_paise

    # Real Razorpay Orders API call
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay credentials missing. Cannot create real order.")

    try:
        resp = httpx.post(
            "https://api.razorpay.com/v1/orders",
            auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
            json={
                "amount": amount,
                "currency": "INR",
                "receipt": f"receipt_{intent_id[:30]}",
                "payment_capture": 1
            },
            timeout=10.0
        )
        resp.raise_for_status()
        rzp_data = resp.json()
        razorpay_order_id = rzp_data.get("id")
        payment_link = f"https://dashboard.razorpay.com/app/orders/{razorpay_order_id}"
    except Exception as e:
        print(f"Razorpay Order creation failed: {e}")
        if isinstance(e, httpx.HTTPStatusError):
            print(f"Razorpay Response: {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to communicate with Razorpay API")
    
    # Save Idempotency Key
    cursor.execute('INSERT INTO idempotency_keys (intent_id, razorpay_order_id, payment_link) VALUES (?, ?, ?)',
                   (intent_id, razorpay_order_id, payment_link))
    conn.commit()
    conn.close()
    
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
        "final_value_paise": amount,
        "idempotent_replay": False
    }

@app.post("/payments/webhook")
async def webhook(request: Request):
    # Live Razorpay Webhook Verification
    raw_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    
    expected_sig = hmac.new(RAZORPAY_WEBHOOK_SECRET, raw_body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_sig, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    
    import json
    try:
        payload = json.loads(raw_body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")
        
    event = payload.get("event")
    event_id = request.headers.get("X-Razorpay-Event-Id", payload.get("event_id", uuid.uuid4().hex))
    
    # Idempotency check for webhook
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Check if event was already processed (we'll just use idempotency_keys for intent, but we should create a webhook_events table)
    cursor.execute('CREATE TABLE IF NOT EXISTS webhook_events (event_id TEXT PRIMARY KEY)')
    cursor.execute('SELECT event_id FROM webhook_events WHERE event_id = ?', (event_id,))
    if cursor.fetchone():
        conn.close()
        return {"status": "already processed"}
    
    cursor.execute('INSERT INTO webhook_events (event_id) VALUES (?)', (event_id,))
    conn.commit()
    conn.close()

    # Process events
    if event in ["payment.captured", "order.paid"]:
        order_id = payload.get("payload", {}).get("payment", {}).get("entity", {}).get("order_id")
        if not order_id:
            # Fallback for order.paid which might have it differently
            order_id = payload.get("payload", {}).get("order", {}).get("entity", {}).get("id")
            
        write_audit({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "intent_id": "webhook",
            "agent_id": "system",
            "action": "webhook",
            "input_summary": f"Received {event}",
            "verdict": None,
            "razorpay_order_id": order_id,
            "razorpay_status": "captured" if event == "payment.captured" else "paid"
        })
        
    return {"status": "ok"}

