from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from services.audit.main import app as audit_app
from services.payments.main import app as payments_app

audit_client = TestClient(audit_app)
payments_client = TestClient(payments_app)

def test_audit_write_and_read():
    entry = {
        "timestamp": "2026-08-22T00:00:00",
        "intent_id": "test_intent_1",
        "agent_id": "agent_x",
        "action": "query",
        "input_summary": "Test query"
    }
    res = audit_client.post("/audit/write", json=entry)
    assert res.status_code == 200
    
    res = audit_client.get("/audit/log?agent_id=agent_x")
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0
    assert logs[0]["intent_id"] == "test_intent_1"

def test_payments_rejects_declined():
    req = {
        "intent": {
            "intent_id": "test",
            "agent_id": "test",
            "agent_name": "test",
            "items": [],
            "requested_discount_pct": 0,
            "cart_value_paise": 100,
            "timestamp": "2026-08-22T00:00:00"
        },
        "verdict": {
            "decision": "declined",
            "rule_fired": "test",
            "reason": "test",
            "policy_version": "v1"
        }
    }
    res = payments_client.post("/payments/create_order", json=req)
    assert res.status_code == 400

def test_payments_accepts_approved():
    req = {
        "intent": {
            "intent_id": "test",
            "agent_id": "test",
            "agent_name": "test",
            "items": [],
            "requested_discount_pct": 0,
            "cart_value_paise": 100,
            "timestamp": "2026-08-22T00:00:00"
        },
        "verdict": {
            "decision": "approved",
            "rule_fired": "test",
            "reason": "test",
            "final_value_paise": 100,
            "policy_version": "v1"
        }
    }
    res = payments_client.post("/payments/create_order", json=req)
    assert res.status_code == 200
    assert "razorpay_order_id" in res.json()
