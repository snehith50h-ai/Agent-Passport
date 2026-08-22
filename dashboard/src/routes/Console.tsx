import { motion } from 'framer-motion';
import { RuleStrip } from '../components/RuleStrip';
import { SpendGauge } from '../components/SpendGauge';
import { Ledger } from '../components/Ledger';
import { AgentCard } from '../components/AgentCard';
import { CatalogSnapshot } from '../components/CatalogSnapshot';
import type { AuditLogEntry } from '../types/audit';

export function Console({ logs, latestEvent }: { logs: AuditLogEntry[], latestEvent: AuditLogEntry | null }) {
  
  // Calculate current spend from successful payments today (mock logic based on feed)
  const currentSpendPaise = logs
    .filter(log => log.action === 'payment' && log.verdict?.decision === 'approved')
    .reduce((sum, log) => sum + (log.verdict?.final_value_paise || 0), 0);
  
  const dailyCapPaise = 50000000; // 500,000 INR (5 Lakhs)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1600px] mx-auto p-6 pt-24 min-h-screen relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Constraints */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <RuleStrip latestEvent={latestEvent} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <SpendGauge currentSpendPaise={currentSpendPaise} capPaise={dailyCapPaise} />
          </motion.div>
        </div>

        {/* Center Column: Live Feed */}
        <div className="lg:col-span-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Ledger logs={logs} />
          </motion.div>
        </div>

        {/* Right Column: Context (Agent & Catalog) */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <AgentCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <CatalogSnapshot />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
