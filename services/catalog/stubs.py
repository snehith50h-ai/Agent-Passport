from datetime import datetime
import os

FIREWALL_URL = os.getenv("FIREWALL_URL", "http://localhost:8001")
AUDIT_URL = os.getenv("AUDIT_URL", "http://localhost:8002")

def evaluate_firewall_stub(intent_data: dict) -> dict:
    """Stub for POST /firewall/evaluate"""
    # Simple logic to simulate firewall in phase 1
    # If the SKU is GIFT-CARD-BULK, decline.
    # Otherwise approve.
    skus = [item["sku"] for item in intent_data.get("items", [])]
    if "GIFT-CARD-BULK" in skus:
        return {
            "decision": "declined",
            "rule_fired": "blocked_skus",
            "reason": "SKU is in blocked list",
            "counter_offer": None,
            "suggested_fix": "Remove the blocked item",
            "final_value_paise": None,
            "policy_version": "v1.0.0"
        }
    return {
        "decision": "approved",
        "rule_fired": "default",
        "reason": "All checks passed",
        "counter_offer": None,
        "suggested_fix": None,
        "final_value_paise": intent_data.get("cart_value_paise", 0),
        "policy_version": "v1.0.0"
    }

def write_audit_stub(action: str, agent_id: str, input_summary: str, intent_id: str = "test-intent", verdict: dict = None):
    """Stub for POST /audit/write"""
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "intent_id": intent_id,
        "agent_id": agent_id,
        "action": action,
        "input_summary": input_summary,
        "verdict": verdict,
        "razorpay_order_id": None,
        "razorpay_status": None
    }
    print(f"[AUDIT STUB] {entry}")
    return {"status": "ok"}
