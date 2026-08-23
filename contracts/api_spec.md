# API Specification

## Boundary APIs

These are the only allowed cross-module boundaries:

- **`POST /catalog/search`**
  - Input: `query` (string)
  - Output: `List[CatalogItem]`

- **`POST /catalog/get_item`**
  - Input: `sku` (string)
  - Output: `CatalogItem`

- **`POST /catalog/negotiate`**
  - Input: `sku` (string), `requested_discount_pct` (float), `agent_id` (string)
  - Output: `FirewallVerdict`

- **`POST /catalog/propose_order`**
  - Input: `OrderIntent`
  - Output: `FirewallVerdict`

- **`POST /firewall/evaluate`**
  - Input: `OrderIntent`, `PolicyConfig`
  - Output: `FirewallVerdict`

- **`POST /payments/create_order`**
  - Input: `OrderIntent`, `FirewallVerdict`
  - Output: `{"razorpay_order_id": str, "payment_link": str}`

- **`POST /audit/write`**
  - Input: `AuditLogEntry`
  - Output: `{"status": "ok"}`

- **`GET /audit/log`**
  - Query Params: Optional `agent_id`
  - Output: `List[AuditLogEntry]`
