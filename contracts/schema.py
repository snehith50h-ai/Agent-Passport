from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel

class CatalogItem(BaseModel):
    sku: str
    name: str
    price_paise: int
    stock: int
    category: str
    refund_window_days: int
    agent_visible: bool

class PolicyConfig(BaseModel):
    policy_version: str
    max_order_value_paise: int
    blocked_skus: List[str]
    discount_ceiling_pct: float
    discount_min_cart_paise: int
    daily_agent_spend_cap_paise: int
    requires_stock_check: bool

class OrderItem(BaseModel):
    sku: str
    qty: int

class OrderIntent(BaseModel):
    intent_id: str
    agent_id: str
    agent_name: str
    items: List[OrderItem]
    requested_discount_pct: float
    cart_value_paise: int
    timestamp: str

class FirewallVerdict(BaseModel):
    decision: Literal["approved", "declined", "countered"]
    rule_fired: str
    reason: str
    counter_offer: Optional[Dict[str, Any]] = None
    suggested_fix: Optional[str] = None
    final_value_paise: Optional[int] = None
    policy_version: str

class AuditLogEntry(BaseModel):
    timestamp: str
    intent_id: str
    agent_id: str
    action: Literal["query", "negotiate", "order_intent", "payment"]
    input_summary: str
    verdict: Optional[FirewallVerdict] = None
    razorpay_order_id: Optional[str] = None
    razorpay_status: Optional[str] = None
