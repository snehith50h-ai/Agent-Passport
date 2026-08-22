import time
import httpx
import uuid

CATALOG_URL = "http://localhost:8000"
PAYMENTS_URL = "http://localhost:8003"
AGENT_ID = "agent-123"

def print_step(title, message):
    print(f"\n[{title}]")
    print(message)
    time.sleep(1)

def demo():
    print("=== Starting Agent Passport Demo ===")
    
    # Happy Path
    print_step("Agent Action", "Searching catalog for 'blue t-shirt'...")
    res = httpx.post(f"{CATALOG_URL}/catalog/search", json={"query": "blue t-shirt"})
    items = res.json()
    if not items:
        print("No items found.")
        return
    sku = items[0]["sku"]
    print(f"Found: {items[0]['name']} (SKU: {sku}) for ₹{items[0]['price_paise']/100}")

    print_step("Agent Action", f"Negotiating a 5% discount on {sku}...")
    res = httpx.post(f"{CATALOG_URL}/catalog/negotiate", json={
        "sku": sku,
        "requested_discount_pct": 5.0,
        "agent_id": AGENT_ID
    })
    verdict = res.json()
    if verdict["decision"] == "approved":
        print(f"Approved: 5% discount allowed on SKU {sku}")
    else:
        print(f"Result: {verdict['decision']} - {verdict['reason']}")

    print_step("Agent Action", "Proposing order...")
    intent = {
        "intent_id": str(uuid.uuid4()),
        "agent_id": AGENT_ID,
        "agent_name": "Demo Buyer",
        "items": [{"sku": sku, "qty": 1}],
        "requested_discount_pct": 5.0,
        "cart_value_paise": items[0]['price_paise'],
        "timestamp": "2026-08-22T00:00:00"
    }
    res = httpx.post(f"{CATALOG_URL}/catalog/propose_order", json=intent)
    order_verdict = res.json()
    print(f"Firewall says: {order_verdict['decision'].upper()} - {order_verdict['reason']}")

    print_step("System Action", "Creating test-mode payment...")
    res = httpx.post(f"{PAYMENTS_URL}/payments/create_order", json={
        "intent": intent,
        "verdict": order_verdict
    })
    if res.status_code == 200:
        payment_data = res.json()
        print(f"Success! Razorpay Order ID: {payment_data['razorpay_order_id']}")
        print(f"Payment Link: {payment_data['payment_link']}")
    else:
        print(f"Failed to create order: {res.text}")

    print("\n--- Starting Failure Path ---")
    
    # Failure Path
    bad_sku = "GIFT-CARD-BULK"
    print_step("Agent Action", f"Attempting to order blocked SKU: {bad_sku}...")
    
    bad_intent = {
        "intent_id": str(uuid.uuid4()),
        "agent_id": AGENT_ID,
        "agent_name": "Demo Buyer",
        "items": [{"sku": bad_sku, "qty": 5}],
        "requested_discount_pct": 0,
        "cart_value_paise": 5000000,
        "timestamp": "2026-08-22T00:00:00"
    }
    res = httpx.post(f"{CATALOG_URL}/catalog/propose_order", json=bad_intent)
    bad_verdict = res.json()
    
    print(f"Declined: SKU {bad_sku} is blocked by merchant policy.")
    print(f"Firewall Reason: {bad_verdict['reason']}")
    
    print_step("System Action", "Attempting payment creation on declined intent...")
    res = httpx.post(f"{PAYMENTS_URL}/payments/create_order", json={
        "intent": bad_intent,
        "verdict": bad_verdict
    })
    if res.status_code == 400:
        print(f"Payment properly rejected: {res.json()['detail']}")
    else:
        print(f"Unexpected payment response: {res.text}")

    print("\n=== Demo Complete! Check Dashboard for Audit Trail ===")

if __name__ == "__main__":
    demo()
