import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

export function SpendGauge({ currentSpendPaise, capPaise }: { currentSpendPaise: number, capPaise: number }) {
  const [displaySpend, setDisplaySpend] = useState(0);

  useEffect(() => {
    const controls = animate(displaySpend, currentSpendPaise / 100, {
      duration: 1,
      onUpdate: (val) => setDisplaySpend(val)
    });
    return controls.stop;
  }, [currentSpendPaise, displaySpend]);

  const percentage = Math.min((currentSpendPaise / capPaise) * 100, 100);
  const isNearCap = percentage > 80;
  
  const capRupees = capPaise / 100;
  
  return (
    <div className="bg-panel/60 backdrop-blur-md border border-steel/50 rounded-xl p-6 shadow-2xl flex flex-col items-center relative overflow-hidden">
      
      {/* Decorative background glow if near cap */}
      {isNearCap && (
        <div className="absolute inset-0 bg-coral/10 animate-pulse pointer-events-none" />
      )}

      <h2 className="text-mist text-xs font-semibold uppercase tracking-wider mb-6 font-mono self-start">Today's Spend</h2>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="80" 
            cy="80" 
            r="70" 
            fill="none" 
            stroke="#152640" 
            strokeWidth="8" 
          />
          {/* Active track */}
          <motion.circle 
            cx="80" 
            cy="80" 
            r="70" 
            fill="none" 
            stroke={isNearCap ? "#EF5350" : "#3B82F6"} 
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 440" }}
            animate={{ strokeDasharray: `${(percentage / 100) * 440} 440` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        <div className="flex flex-col items-center">
          <span className="text-mist text-xs font-mono mb-1">INR</span>
          <span className={`text-2xl font-mono font-bold ${isNearCap ? 'text-coral' : 'text-paper'}`}>
            {displaySpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between w-full text-xs font-mono">
        <span className="text-mist">0</span>
        <span className="text-mist">CAP: {capRupees.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
