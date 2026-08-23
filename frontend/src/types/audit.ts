export type AuditLogEntry = {
  timestamp: string;
  intent_id: string;
  agent_id: string;
  action: "query" | "negotiate" | "order_intent" | "payment";
  input_summary: string;
  verdict: {
    decision: "approved" | "declined" | "countered";
    rule_fired: string;
    reason: string;
    final_value_paise: number | null;
  } | null;
  razorpay_order_id: string | null;
  razorpay_status: string | null;
};
