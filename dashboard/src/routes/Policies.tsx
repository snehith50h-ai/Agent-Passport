import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../components/Panel';
import { Data } from '../components/Data';

export function Policies() {
  const [showToast, setShowToast] = useState(false);
  const [rules, setRules] = useState({
    max_order_value: 10000,
    discount_ceiling: 15,
    daily_spend_cap: 2000,
    stock_check: true
  });

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 pt-24 min-h-screen relative z-10">
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold text-paper mb-2">Policy Configuration</h1>
          <p className="font-body text-mist">Set deterministic bounds for autonomous agents.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2 bg-signal-blue text-ink rounded font-display font-bold uppercase tracking-wider hover:bg-signal-blue/90 transition-colors"
        >
          Deploy Policies
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor */}
        <Panel className="lg:col-span-2 p-8">
          <div className="space-y-8">
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block font-display text-sm uppercase tracking-wider text-mist mb-2">Max Order Value (INR)</label>
                <input 
                  type="number" 
                  value={rules.max_order_value}
                  onChange={(e) => setRules({...rules, max_order_value: Number(e.target.value)})}
                  className="w-full bg-ink/50 border border-steel/50 rounded p-3 text-paper font-mono focus:border-signal-blue focus:outline-none transition-colors" 
                />
              </div>
              
              <div>
                <label className="block font-display text-sm uppercase tracking-wider text-mist mb-2">Daily Agent Spend Cap (INR)</label>
                <input 
                  type="number" 
                  value={rules.daily_spend_cap}
                  onChange={(e) => setRules({...rules, daily_spend_cap: Number(e.target.value)})}
                  className="w-full bg-ink/50 border border-steel/50 rounded p-3 text-paper font-mono focus:border-signal-blue focus:outline-none transition-colors" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-display text-sm uppercase tracking-wider text-mist">Discount Ceiling</label>
                <Data className="text-signal-blue">{rules.discount_ceiling}%</Data>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={rules.discount_ceiling}
                onChange={(e) => setRules({...rules, discount_ceiling: Number(e.target.value)})}
                className="w-full accent-signal-blue h-2 bg-steel/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-steel/30 pt-8">
              <div>
                <label className="font-display text-sm uppercase tracking-wider text-paper block">Enforce Stock Check</label>
                <p className="text-xs text-mist font-body mt-1">Block orders for SKUs with 0 inventory.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={rules.stock_check}
                  onChange={(e) => setRules({...rules, stock_check: e.target.checked})}
                />
                <div className="w-11 h-6 bg-steel/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-paper after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal-blue"></div>
              </label>
            </div>

          </div>
        </Panel>

        {/* Simulator */}
        <Panel className="p-6 flex flex-col">
          <h2 className="font-display text-sm uppercase tracking-wider text-mist mb-6 border-b border-steel/30 pb-4">
            Simulator
          </h2>
          <div className="flex-1">
            <p className="font-body text-sm text-paper mb-4">Test current policies against a mock request.</p>
            
            <div className="p-4 bg-ink/50 border border-steel/30 rounded mb-4 font-mono text-xs text-mist space-y-2">
              <div>Intent: <span className="text-paper">ORDER</span></div>
              <div>Cart Value: <span className="text-paper">₹25,000</span></div>
              <div>Discount Req: <span className="text-paper">20%</span></div>
            </div>

            {rules.discount_ceiling < 20 ? (
               <div className="p-4 border border-coral/30 bg-coral/10 rounded">
                 <div className="font-mono text-xs font-bold text-coral uppercase mb-1">Countered</div>
                 <p className="text-xs text-paper font-body">Requested discount (20%) exceeds ceiling ({rules.discount_ceiling}%).</p>
               </div>
            ) : rules.max_order_value < 25000 ? (
              <div className="p-4 border border-coral/30 bg-coral/10 rounded">
                 <div className="font-mono text-xs font-bold text-coral uppercase mb-1">Declined</div>
                 <p className="text-xs text-paper font-body">Cart value exceeds max order limit.</p>
               </div>
            ) : (
               <div className="p-4 border border-mint/30 bg-mint/10 rounded">
                 <div className="font-mono text-xs font-bold text-mint uppercase mb-1">Approved</div>
                 <p className="text-xs text-paper font-body">Passes all checks.</p>
               </div>
            )}
          </div>
        </Panel>

      </div>

      {/* Toast */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 bg-mint text-ink px-6 py-3 rounded shadow-lg font-mono text-sm font-bold flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-ink rounded-full" />
          POLICY_V2_DEPLOYED
        </motion.div>
      )}

    </div>
  );
}
