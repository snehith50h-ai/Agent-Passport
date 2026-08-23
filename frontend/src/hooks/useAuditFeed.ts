import { useState, useEffect, useRef } from 'react';
import type { AuditLogEntry } from '../types/audit';
import { mockFixtures } from '../mock/audit-feed';

// Force live backend by default for the real demo
const USE_MOCK = import.meta.env.VITE_USE_MOCK_FEED === 'true';
const POLL_INTERVAL = 3000;

export function useAuditFeed() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  
  // For mock simulation
  const mockIndexRef = useRef(0);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchLogs = async () => {
      if (USE_MOCK) {
        // Simulate live feed by pushing one mock item at a time
        if (mockIndexRef.current < mockFixtures.length) {
          const nextItem = mockFixtures[mockIndexRef.current];
          // Ensure it has a current timestamp so it feels live
          const liveItem = { ...nextItem, timestamp: new Date().toISOString() };
          
          setLogs(prev => [liveItem, ...prev]);
          mockIndexRef.current++;
        } else {
          // Reset mock index to cycle the demo infinitely
          mockIndexRef.current = 0;
        }
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";
        const res = await fetch(`${API_URL}/audit/log`);
        if (res.ok) {
          const data: AuditLogEntry[] = await res.json();
          // Assuming backend returns all logs, or we'd need cursor logic.
          // For simplicity, just replace if it returns full history, 
          // or prepend if we do cursor. Let's assume full history returned in descending order.
          // Let's sort descending just in case.
          const sorted = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setLogs(sorted);
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      } catch (e) {
        console.error("Failed to fetch audit log:", e);
        setIsLive(false);
      }
    };

    // Initial fetch
    fetchLogs();
    
    intervalId = setInterval(fetchLogs, POLL_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return {
    logs,
    isLive
  };
}
