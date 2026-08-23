# Antigravity Agentic Integration: Provably Real

This repository serves as a showcase for a "provably real" integration between an AI Agent, a Policy Firewall, and the Razorpay API.

## Proof of Liveness (For Judges)

The system is configured to prove that the integration is real and not just local simulation. It connects to the actual Razorpay Orders API (`POST /v1/orders`) and verifies the integrity of webhooks via cryptographic signatures (`x-razorpay-signature`).

### How to Run the Demo Buyer Script
1. **Set your Razorpay Test Credentials**: Before running, ensure your test API keys are available in the environment variables (e.g., inside your terminal or a `.env` file):
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET` (For testing webhook verifications).
2. **Start the backend services**:
   ```powershell
   ./start_servers.ps1
   ```
3. **Run the buyer agent**:
   ```powershell
   cd backend && python demo/buyer_agent/agent.py
   ```
4. **Watch a real order get created**:
   The CLI script will output a success message like `Success! Razorpay Order ID: order_XXXXX` along with a dashboard link.

### How to Check the Razorpay Dashboard (Test Mode)
1. Log into your Razorpay account and ensure you are in **Test Mode**.
2. Navigate to **Transactions > Orders** on the left menu (or follow the direct `https://dashboard.razorpay.com/app/orders/...` link from the demo output).
3. You will see the corresponding test order appear, with the exact amount negotiated by the agent!

### Audit Log & Webhook Reality
- **Audit log entries reflect webhook-confirmed status, not client-side assumptions.** See `backend/services/payments/main.py`'s `/payments/webhook` handler for the HMAC-SHA256 signature verification logic.
- We do not write an `order.paid` or `payment.captured` event to the audit ledger until we successfully verify the incoming webhook payload.

### The Failure Case (Provably Zero Interaction)
The demo agent attempts to buy a blocked SKU (`GIFT-CARD-BULK`). The Policy Firewall evaluates this request and actively declines it. This failure is logged internally *before* any Razorpay call is attempted. 
- You will see the declined verdict logged locally.
- If you check the Razorpay Dashboard, there is a visible **absence** of any corresponding failed/declined order for that amount. That absence is itself part of the proof that the firewall gating works properly before initiating third-party resource calls.
