import type { AuditLogEntry } from '../types/audit';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Panel } from './Panel';

const RULES = [
  { id: 'blocked_skus', label: 'Blocked SKUs' },
  { id: 'stock', label: 'Stock Check' },
  { id: 'discount_ceiling_pct', label: 'Discount Ceiling' },
  { id: 'max_order_value', label: 'Max Order Value' },
  { id: 'daily_spend_cap', label: 'Daily Spend Cap' }
];

export function RuleStrip({ latestEvent }: { latestEvent: AuditLogEntry | null }) {
  const [activeRule, setActiveRule] = useState<{ id: string, decision: string } | null>(null);

  useEffect(() => {
    if (latestEvent?.verdict?.rule_fired && latestEvent.verdict.rule_fired !== 'none') {
      setActiveRule({
        id: latestEvent.verdict.rule_fired,
        decision: latestEvent.verdict.decision
      });
      
      const timer = setTimeout(() => {
        setActiveRule(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [latestEvent]);

  return (
    <Panel className="p-8">
      <h2 className="text-mist text-[12px] uppercase tracking-[0.05em] mb-6 font-display">Policy Firewall Rules</h2>
      <div className="flex flex-col gap-3">
        {RULES.map(rule => {
          const isActive = activeRule?.id === rule.id;
          
          let bgColor = 'bg-panel-2';
          let textColor = 'text-paper';
          let borderClasses = 'border-transparent';
          
          if (isActive) {
            if (activeRule.decision === 'declined') {
              bgColor = 'bg-coral/20';
              textColor = 'text-coral';
              borderClasses = 'border-coral border';
            } else if (activeRule.decision === 'countered') {
              bgColor = 'bg-amber/20';
              textColor = 'text-amber';
              borderClasses = 'border-amber border';
            } else if (activeRule.decision === 'approved') {
              bgColor = 'bg-mint/20';
              textColor = 'text-mint';
              borderClasses = 'border-mint border';
            }
          } else {
            borderClasses = 'border border-transparent';
          }

          return (
            <motion.div
              key={rule.id}
              layout
              animate={{ 
                scale: isActive ? 1.02 : 1,
                backgroundColor: isActive ? 'transparent' : undefined
              }}
              className={`px-4 py-3 rounded-lg ${borderClasses} ${bgColor} transition-colors duration-300 flex items-center justify-between`}
            >
              <span className={`text-[14px] font-medium ${textColor} transition-colors duration-300 font-body`}>
                {rule.label}
              </span>
              
              {isActive && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs font-mono font-bold uppercase ${textColor}`}
                >
                  {activeRule.decision}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </Panel>
  );
}
