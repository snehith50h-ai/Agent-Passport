def evaluate_rules(intent: dict, policy: dict, catalog_map: dict, current_spend: int) -> dict:
    skus = [item["sku"] for item in intent.get("items", [])]
    req_discount_pct = intent.get("requested_discount_pct", 0.0)
    
    # 1. blocked_skus
    for sku in skus:
        if sku in policy.get("blocked_skus", []):
            return {
                "decision": "declined",
                "rule_fired": "blocked_skus",
                "reason": f"SKU {sku} is blocked.",
                "counter_offer": None,
                "suggested_fix": f"Remove {sku} from the order.",
                "final_value_paise": None,
                "policy_version": policy.get("policy_version")
            }

    # Calculate actual cart value from catalog
    actual_cart_value = sum(
        catalog_map[item["sku"]]["price_paise"] * item["qty"] 
        for item in intent.get("items", []) if item["sku"] in catalog_map
    )
    
    # 2. requires_stock_check
    if policy.get("requires_stock_check", False):
        for item in intent.get("items", []):
            sku = item["sku"]
            req_qty = item["qty"]
            if sku in catalog_map:
                if catalog_map[sku]["stock"] < req_qty:
                    return {
                        "decision": "declined",
                        "rule_fired": "requires_stock_check",
                        "reason": f"Insufficient stock for {sku}.",
                        "counter_offer": None,
                        "suggested_fix": f"Reduce quantity of {sku}.",
                        "final_value_paise": None,
                        "policy_version": policy.get("policy_version")
                    }

    # 3. discount logic
    discount_ceiling = policy.get("discount_ceiling_pct", 0.0)
    min_cart = policy.get("discount_min_cart_paise", 0)
    if req_discount_pct > 0:
        if actual_cart_value < min_cart:
            return {
                "decision": "countered",
                "rule_fired": "discount_min_cart_paise",
                "reason": f"Cart value {actual_cart_value} is below the minimum {min_cart}.",
                "counter_offer": {"allowed_discount_pct": 0.0},
                "suggested_fix": "Add items to reach minimum cart value.",
                "final_value_paise": actual_cart_value,
                "policy_version": policy.get("policy_version")
            }
        elif req_discount_pct > discount_ceiling:
            allowed_final = int(actual_cart_value * (1 - discount_ceiling / 100))
            return {
                "decision": "countered",
                "rule_fired": "discount_ceiling_pct",
                "reason": f"Discount {req_discount_pct}% exceeds ceiling of {discount_ceiling}%.",
                "counter_offer": {"allowed_discount_pct": discount_ceiling},
                "suggested_fix": "Accept maximum allowed discount.",
                "final_value_paise": allowed_final,
                "policy_version": policy.get("policy_version")
            }
            
    final_value = int(actual_cart_value * (1 - req_discount_pct / 100))

    # 4. max_order_value_paise
    max_order = policy.get("max_order_value_paise")
    if final_value > max_order:
        return {
            "decision": "declined",
            "rule_fired": "max_order_value_paise",
            "reason": f"Final value {final_value} exceeds maximum {max_order}.",
            "counter_offer": None,
            "suggested_fix": "Reduce order value.",
            "final_value_paise": None,
            "policy_version": policy.get("policy_version")
        }

    # 5. daily_agent_spend_cap_paise
    daily_cap = policy.get("daily_agent_spend_cap_paise")
    if current_spend + final_value > daily_cap:
        return {
            "decision": "declined",
            "rule_fired": "daily_agent_spend_cap_paise",
            "reason": f"Adding {final_value} exceeds daily cap. Current spend: {current_spend}.",
            "counter_offer": None,
            "suggested_fix": "Wait until tomorrow.",
            "final_value_paise": None,
            "policy_version": policy.get("policy_version")
        }

    return {
        "decision": "approved",
        "rule_fired": "default",
        "reason": "All checks passed.",
        "counter_offer": None,
        "suggested_fix": None,
        "final_value_paise": final_value,
        "policy_version": policy.get("policy_version")
    }
