import { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { useSpendGauge } from '../hooks/useSpendGauge';
import { Panel } from './Panel';
import { Data } from './Data';

export function SpendGauge({ currentSpendPaise, capPaise }: { currentSpendPaise: number, capPaise: number }) {
  const { percentage, displaySpend, capRupees, isNearCap } = useSpendGauge(currentSpendPaise, capPaise);
  
  const [animatedSpend, setAnimatedSpend] = useState(0);
  const prevSpend = useRef(0);

  useEffect(() => {
    const controls = animate(prevSpend.current, displaySpend, {
      duration: 1,
      onUpdate: (val) => setAnimatedSpend(val)
    });
    prevSpend.current = displaySpend;
    return controls.stop;
  }, [displaySpend]);

  return (
    <Panel className="p-8 flex flex-col items-center relative overflow-hidden h-full min-h-[300px]">
      {/* Decorative background glow if near cap */}
      {isNearCap && (
        <div className="absolute inset-0 bg-coral/10 animate-pulse pointer-events-none" />
      )}

      <h2 className="text-mist text-[12px] uppercase tracking-[0.05em] mb-8 font-display self-start">Today's Spend</h2>
      
      <div className="relative w-48 h-48 flex items-center justify-center flex-1">
        {/* Background track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="96" 
            cy="96" 
            r="80" 
            fill="none" 
            stroke="rgba(43,68,104,0.3)" // steel/30
            strokeWidth="12" 
          />
          {/* Active track (Partial Arc) */}
          <motion.circle 
            cx="96" 
            cy="96" 
            r="80" 
            fill="none" 
            stroke={isNearCap ? "#EF5350" : "#3B82F6"} 
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        <div className="flex flex-col items-center z-10">
          <span className="text-mist text-[12px] font-mono mb-1">INR</span>
          <Data className={`text-[32px] font-bold tracking-tight ${isNearCap ? 'text-coral' : 'text-paper'}`}>
            {animatedSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </Data>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between w-full text-xs font-mono">
        <Data className="text-mist">0</Data>
        <Data className="text-mist">CAP: {capRupees.toLocaleString('en-IN')}</Data>
      </div>
    </Panel>
  );
}
