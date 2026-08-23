import os
import sqlite3
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import sys
import hashlib

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from contracts.schema import AuditLogEntry

app = FastAPI(title="Audit Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.getenv("AUDIT_DB_PATH", os.path.join(os.path.dirname(__file__), "audit.db"))

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            intent_id TEXT,
            agent_id TEXT,
            action TEXT,
            input_summary TEXT,
            verdict JSON,
            razorpay_order_id TEXT,
            razorpay_status TEXT,
            hash TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.post("/audit/write")
def write_audit(entry: AuditLogEntry):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    verdict_json = entry.verdict.model_dump_json() if entry.verdict else None
    
    
    # Retrieve previous hash
    cursor.execute('SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1')
    prev_row = cursor.fetchone()
    prev_hash = prev_row[0] if prev_row and prev_row[0] else "0000000000000000000000000000000000000000000000000000000000000000"
    
    raw_str = f"{prev_hash}{entry.timestamp}{entry.intent_id}{entry.action}{verdict_json or ''}"
    current_hash = hashlib.sha256(raw_str.encode()).hexdigest()
    
    cursor.execute('''
        INSERT INTO audit_log (timestamp, intent_id, agent_id, action, input_summary, verdict, razorpay_order_id, razorpay_status, hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        entry.timestamp, entry.intent_id, entry.agent_id, entry.action,
        entry.input_summary, verdict_json, entry.razorpay_order_id, entry.razorpay_status, current_hash
    ))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.get("/audit/log", response_model=List[AuditLogEntry])
def get_audit_log(agent_id: Optional[str] = Query(None)):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if agent_id:
        cursor.execute("SELECT * FROM audit_log WHERE agent_id = ? ORDER BY timestamp DESC", (agent_id,))
    else:
        cursor.execute("SELECT * FROM audit_log ORDER BY timestamp DESC")
        
    rows = cursor.fetchall()
    conn.close()
    
    import json
    entries = []
    for row in rows:
        verdict = json.loads(row[6]) if row[6] else None
        entries.append(AuditLogEntry(
            timestamp=row[1],
            intent_id=row[2],
            agent_id=row[3],
            action=row[4],
            input_summary=row[5],
            verdict=verdict,
            razorpay_order_id=row[7],
            razorpay_status=row[8],
            hash=row[9]
        ))
    return entries
