import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AuditLogEntry } from '../types/audit';

export function FlowBackground({ latestEvent }: { latestEvent: AuditLogEntry | null }) {
  const [pulsePath, setPulsePath] = useState<string | null>(null);

  useEffect(() => {
    if (latestEvent) {
      // Trigger a pulse
      setPulsePath(latestEvent.action);
      
      const timer = setTimeout(() => {
        setPulsePath(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [latestEvent]);

  // We use simple SVG lines connecting nodes to simulate a network graph
  // Background fixed and low opacity
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-30 overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#101E33" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Static Base Lines */}
        <path d="M 100 200 C 300 200, 300 400, 500 400" fill="transparent" stroke="#2B4468" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 500 400 C 700 400, 700 200, 900 200" fill="transparent" stroke="#2B4468" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 500 400 C 700 400, 700 600, 900 600" fill="transparent" stroke="#2B4468" strokeWidth="2" strokeDasharray="4 4" />

        {/* Pulse Animations when an event occurs */}
        {pulsePath && (
          <motion.circle 
            r="4" 
            fill="#3B82F6"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 1.5, ease: "linear" }}
            style={{ offsetPath: "path('M 100 200 C 300 200, 300 400, 500 400')" } as React.CSSProperties}
          />
        )}
        
        {pulsePath === 'payment' && (
          <motion.circle 
            r="4" 
            fill="#22C08A"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 1.5, ease: "linear", delay: 1.5 }}
            style={{ offsetPath: "path('M 500 400 C 700 400, 700 200, 900 200')" } as React.CSSProperties}
          />
        )}
        
        {pulsePath && pulsePath !== 'payment' && (
          <motion.circle 
            r="4" 
            fill="#EF5350"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 1.5, ease: "linear", delay: 1.5 }}
            style={{ offsetPath: "path('M 500 400 C 700 400, 700 600, 900 600')" } as React.CSSProperties}
          />
        )}

        {/* Nodes */}
        <circle cx="100" cy="200" r="40" fill="url(#nodeGrad)" />
        <circle cx="500" cy="400" r="60" fill="url(#nodeGrad)" />
        <circle cx="900" cy="200" r="40" fill="url(#nodeGrad)" />
        <circle cx="900" cy="600" r="40" fill="url(#nodeGrad)" />

        <text x="100" y="250" fill="#8FA0BE" fontSize="12" textAnchor="middle" className="font-mono">Agent</text>
        <text x="500" y="480" fill="#8FA0BE" fontSize="12" textAnchor="middle" className="font-mono">Firewall</text>
        <text x="900" y="250" fill="#8FA0BE" fontSize="12" textAnchor="middle" className="font-mono">Payment</text>
        <text x="900" y="650" fill="#8FA0BE" fontSize="12" textAnchor="middle" className="font-mono">Audit</text>
      </svg>
    </div>
  );
}
