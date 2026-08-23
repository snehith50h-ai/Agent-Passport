import type { AuditLogEntry } from '../types/audit';

const NOW = Date.now();

export const mockFixtures: AuditLogEntry[] = [
  {
    timestamp: new Date(NOW - 15000).toISOString(),
    intent_id: "int_1",
    agent_id: "agent_alpha",
    action: "query",
    input_summary: "Queried catalog for MacBook Pro 16",
    verdict: {
      decision: "approved",
      rule_fired: "none",
      reason: "Catalog access granted.",
      final_value_paise: null
    },
    razorpay_order_id: null,
    razorpay_status: null
  },
  {
    timestamp: new Date(NOW - 12000).toISOString(),
    intent_id: "int_2",
    agent_id: "agent_alpha",
    action: "order_intent",
    input_summary: "Attempted to buy blocked SKU: GIFT-CARD-BULK",
    verdict: {
      decision: "declined",
      rule_fired: "blocked_skus",
      reason: "SKU 'GIFT-CARD-BULK' is on the restricted list.",
      final_value_paise: null
    },
    razorpay_order_id: null,
    razorpay_status: null
  },
  {
    timestamp: new Date(NOW - 8000).toISOString(),
    intent_id: "int_3",
    agent_id: "agent_alpha",
    action: "negotiate",
    input_summary: "Requested 15% discount on iPhone 15 Pro",
    verdict: {
      decision: "countered",
      rule_fired: "discount_ceiling_pct",
      reason: "Requested discount exceeds 10% ceiling. Countering with 10%.",
      final_value_paise: 11691000 // 129900 * 0.9 in paise
    },
    razorpay_order_id: null,
    razorpay_status: null
  },
  {
    timestamp: new Date(NOW - 2000).toISOString(),
    intent_id: "int_4",
    agent_id: "agent_alpha",
    action: "order_intent",
    input_summary: "Attempted bulk order of 5x MacBooks (Value: 12.5L)",
    verdict: {
      decision: "declined",
      rule_fired: "max_order_value",
      reason: "Order value exceeds per-transaction limit of ₹10,00,000.",
      final_value_paise: 125000000
    },
    razorpay_order_id: null,
    razorpay_status: null
  },
  {
    timestamp: new Date(NOW - 500).toISOString(),
    intent_id: "int_5",
    agent_id: "agent_alpha",
    action: "payment",
    input_summary: "Payment for iPhone 15 Pro (Counter offer accepted)",
    verdict: {
      decision: "approved",
      rule_fired: "none",
      reason: "Payment intent verified and within limits.",
      final_value_paise: 11691000
    },
    razorpay_order_id: "order_PxYQ8Z1r2",
    razorpay_status: "created"
  }
];
