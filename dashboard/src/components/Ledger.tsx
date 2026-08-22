import type { AuditLogEntry } from '../types/audit';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, ArrowRightLeft, CreditCard, Search } from 'lucide-react';

export function Ledger({ logs }: { logs: AuditLogEntry[] }) {
  
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'query': return <Search className="w-4 h-4" />;
      case 'negotiate': return <ArrowRightLeft className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const stats = logs.reduce((acc, log) => {
    if (log.verdict) {
      if (log.verdict.decision === 'approved') acc.approved++;
      if (log.verdict.decision === 'countered') acc.countered++;
      if (log.verdict.decision === 'declined') acc.declined++;
    }
    return acc;
  }, { approved: 0, countered: 0, declined: 0 });

  return (
    <div className="bg-panel/80 backdrop-blur-md border border-steel/50 rounded-xl shadow-2xl flex flex-col h-[700px] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-steel/50 flex justify-between items-center bg-panel-2/50">
        <h2 className="text-paper text-sm font-semibold uppercase tracking-wider font-mono">Live Decision Ledger</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-blue"></span>
          </span>
          <span className="text-signal-blue text-xs font-mono uppercase">Feed Active</span>
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        <AnimatePresence initial={false}>
          {logs.map((log) => {
            const isApproved = log.verdict?.decision === 'approved';
            const isCountered = log.verdict?.decision === 'countered';
            const isDeclined = log.verdict?.decision === 'declined';
            
            let badgeColor = 'bg-mist/10 text-mist border-mist/20';
            let Icon = AlertCircle;
            
            if (isApproved) {
              badgeColor = 'bg-mint/10 text-mint border-mint/20';
              Icon = CheckCircle2;
            } else if (isCountered) {
              badgeColor = 'bg-amber/10 text-amber border-amber/20';
              Icon = AlertTriangle;
            } else if (isDeclined) {
              badgeColor = 'bg-coral/10 text-coral border-coral/20';
              Icon = AlertCircle;
            }

            return (
              <motion.div
                key={`${log.intent_id}-${log.timestamp}`}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className="p-4 rounded-lg bg-panel-2/50 border border-steel/30 hover:border-steel/60 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-mist">
                    <span className="flex items-center gap-1">
                      {getActionIcon(log.action)}
                      {log.action.toUpperCase()}
                    </span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  {log.verdict && (
                    <div className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase border flex items-center gap-1 ${badgeColor}`}>
                      <Icon className="w-3 h-3" />
                      {log.verdict.decision}
                    </div>
                  )}
                </div>

                <p className="text-sm text-paper font-medium leading-relaxed mb-3">
                  {log.input_summary}
                </p>

                {log.verdict && (
                  <div className="bg-ink/50 rounded p-3 border border-steel/20">
                    <p className="text-xs text-mist leading-relaxed">
                      {log.verdict.reason}
                    </p>
                    {log.verdict.final_value_paise !== null && (
                      <p className="text-xs font-mono text-paper mt-2 flex justify-between border-t border-steel/20 pt-2">
                        <span>Final Value</span>
                        <span>₹{(log.verdict.final_value_paise / 100).toLocaleString('en-IN')}</span>
                      </p>
                    )}
                  </div>
                )}
                
                <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-mist/60">
                  <span>Agent ID: {log.agent_id}</span>
                  {log.razorpay_order_id && (
                    <span className="text-signal-blue/80">Order: {log.razorpay_order_id}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-mist/50 text-sm font-mono">
            Waiting for events...
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 bg-ink/80 border-t border-steel/50 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-mono text-mint font-bold">{stats.approved}</div>
          <div className="text-[10px] uppercase font-mono text-mist tracking-wider mt-1">Approved</div>
        </div>
        <div className="text-center border-l border-steel/30">
          <div className="text-2xl font-mono text-amber font-bold">{stats.countered}</div>
          <div className="text-[10px] uppercase font-mono text-mist tracking-wider mt-1">Countered</div>
        </div>
        <div className="text-center border-l border-steel/30">
          <div className="text-2xl font-mono text-coral font-bold">{stats.declined}</div>
          <div className="text-[10px] uppercase font-mono text-mist tracking-wider mt-1">Declined</div>
        </div>
      </div>
    </div>
  );
}
