import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from services.firewall.evaluator import evaluate_rules

catalog_map = {
    "ITEM-1": {"sku": "ITEM-1", "price_paise": 1000, "stock": 5},
    "BLOCKED-1": {"sku": "BLOCKED-1", "price_paise": 2000, "stock": 10}
}

base_policy = {
    "policy_version": "v1.0",
    "blocked_skus": ["BLOCKED-1"],
    "requires_stock_check": True,
    "discount_ceiling_pct": 10.0,
    "discount_min_cart_paise": 500,
    "max_order_value_paise": 5000,
    "daily_agent_spend_cap_paise": 10000
}

def test_rule_blocked_skus():
    intent = {"items": [{"sku": "BLOCKED-1", "qty": 1}]}
    verdict = evaluate_rules(intent, base_policy, catalog_map, 0)
    assert verdict["decision"] == "declined"
    assert verdict["rule_fired"] == "blocked_skus"

def test_rule_stock_check():
    intent = {"items": [{"sku": "ITEM-1", "qty": 10}]} # Requesting 10, stock is 5
    verdict = evaluate_rules(intent, base_policy, catalog_map, 0)
    assert verdict["decision"] == "declined"
    assert verdict["rule_fired"] == "requires_stock_check"

def test_rule_discount_min_cart():
    intent = {"items": [{"sku": "ITEM-1", "qty": 1}], "requested_discount_pct": 5.0} # Value 1000, allowed.
    # Change minimum to 2000
    policy = dict(base_policy, discount_min_cart_paise=2000)
    verdict = evaluate_rules(intent, policy, catalog_map, 0)
    assert verdict["decision"] == "countered"
    assert verdict["rule_fired"] == "discount_min_cart_paise"
    assert verdict["counter_offer"]["allowed_discount_pct"] == 0.0

def test_rule_discount_ceiling():
    intent = {"items": [{"sku": "ITEM-1", "qty": 1}], "requested_discount_pct": 20.0} # 20% > 10%
    verdict = evaluate_rules(intent, base_policy, catalog_map, 0)
    assert verdict["decision"] == "countered"
    assert verdict["rule_fired"] == "discount_ceiling_pct"
    assert verdict["counter_offer"]["allowed_discount_pct"] == 10.0

def test_rule_max_order_value():
    intent = {"items": [{"sku": "ITEM-1", "qty": 6}]} # Value 6000 > 5000 cap
    # need to disable stock check so it passes stock check
    policy = dict(base_policy, requires_stock_check=False)
    verdict = evaluate_rules(intent, policy, catalog_map, 0)
    assert verdict["decision"] == "declined"
    assert verdict["rule_fired"] == "max_order_value_paise"

def test_rule_daily_spend_cap():
    intent = {"items": [{"sku": "ITEM-1", "qty": 2}]} # Value 2000
    # cap is 10000, current spend 9000
    verdict = evaluate_rules(intent, base_policy, catalog_map, 9000)
    assert verdict["decision"] == "declined"
    assert verdict["rule_fired"] == "daily_agent_spend_cap_paise"

def test_approved_path():
    intent = {"items": [{"sku": "ITEM-1", "qty": 1}], "requested_discount_pct": 5.0}
    verdict = evaluate_rules(intent, base_policy, catalog_map, 0)
    assert verdict["decision"] == "approved"
    assert verdict["final_value_paise"] == 950

def test_rule_order_proof():
    # If blocked sku AND stock out, blocked sku should fire first.
    intent = {"items": [{"sku": "BLOCKED-1", "qty": 100}]}
    verdict = evaluate_rules(intent, base_policy, catalog_map, 0)
    assert verdict["rule_fired"] == "blocked_skus"
