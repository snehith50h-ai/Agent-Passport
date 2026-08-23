from fastapi import FastAPI
from pydantic import BaseModel
import json
import os
import sqlite3
import datetime
import sys
import hmac
import hashlib

from .evaluator import evaluate_rules

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from contracts.schema import OrderIntent, PolicyConfig, FirewallVerdict

app = FastAPI(title="Policy Firewall")

DB_PATH = os.getenv("FIREWALL_DB_PATH", os.path.join(os.path.dirname(__file__), "spend.db"))
FIREWALL_SECRET = os.getenv("FIREWALL_SECRET", "supersecret_firewall_key").encode()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS daily_spend (
            agent_id TEXT,
            date TEXT,
            spend_paise INTEGER,
            PRIMARY KEY (agent_id, date)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_current_date() -> str:
    from datetime import timezone
    return datetime.datetime.now(timezone.utc).date().isoformat()

def get_daily_spend(agent_id: str, date: str) -> int:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT spend_paise FROM daily_spend WHERE agent_id = ? AND date = ?', (agent_id, date))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else 0

def add_daily_spend(agent_id: str, date: str, amount_paise: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    current = get_daily_spend(agent_id, date)
    new_total = current + amount_paise
    cursor.execute('INSERT OR REPLACE INTO daily_spend (agent_id, date, spend_paise) VALUES (?, ?, ?)',
                   (agent_id, date, new_total))
    conn.commit()
    conn.close()

def get_catalog_map() -> dict:
    catalog_path = os.path.join(os.path.dirname(__file__), '../../seed/merchant_catalog.json')
    with open(catalog_path, 'r') as f:
        data = json.load(f)
        return {item['sku']: item for item in data}

class EvaluateRequest(BaseModel):
    intent: dict # OrderIntent
    policy: dict # PolicyConfig
    commit_spend: bool = False

@app.post("/firewall/evaluate", response_model=FirewallVerdict)
def evaluate(req: EvaluateRequest):
    agent_id = req.intent.get("agent_id", "unknown")
    today = get_current_date()
    current_spend = get_daily_spend(agent_id, today)
    catalog_map = get_catalog_map()
    
    verdict = evaluate_rules(req.intent, req.policy, catalog_map, current_spend)
    
    if req.commit_spend and verdict["decision"] == "approved":
        add_daily_spend(agent_id, today, verdict["final_value_paise"])

    intent_id = req.intent.get("intent_id", "")
    decision = verdict["decision"]
    # Cryptographically sign the verdict to prevent direct hits to the payment gateway
    signature = hmac.new(FIREWALL_SECRET, f"{intent_id}:{decision}".encode(), hashlib.sha256).hexdigest()
    verdict["signature"] = signature

    return verdict
