from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from services.catalog.main import app

client = TestClient(app)

def test_search_catalog():
    response = client.post("/catalog/search", json={"query": "shirt"})
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 2
    assert "TSHIRT-01" in [i["sku"] for i in items]

def test_negotiate_approved():
    response = client.post("/catalog/negotiate", json={
        "sku": "HOODIE-01",
        "requested_discount_pct": 5.0,
        "agent_id": "agent-123"
    })
    assert response.status_code == 200
    verdict = response.json()
    assert verdict["decision"] == "approved"

def test_negotiate_declined():
    # Because of our stub logic, GIFT-CARD-BULK is declined
    response = client.post("/catalog/negotiate", json={
        "sku": "GIFT-CARD-BULK",
        "requested_discount_pct": 5.0,
        "agent_id": "agent-123"
    })
    assert response.status_code == 200
    verdict = response.json()
    assert verdict["decision"] == "declined"
