import { useAuditFeed } from './hooks/useAuditFeed';
import { FlowBackground } from './components/FlowBackground';
import { RuleStrip } from './components/RuleStrip';
import { SpendGauge } from './components/SpendGauge';
import { Ledger } from './components/Ledger';
import { AgentCard } from './components/AgentCard';
import { CatalogSnapshot } from './components/CatalogSnapshot';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const { logs, isLive } = useAuditFeed();
  const latestEvent = logs.length > 0 ? logs[0] : null;

  // Calculate today's spend across all approved payments
  const currentSpendPaise = logs.reduce((total, log) => {
    if (log.action === 'payment' && log.verdict?.decision === 'approved' && log.verdict.final_value_paise) {
      return total + log.verdict.final_value_paise;
    }
    return total;
  }, 0);

  const CAP_PAISE = 50000000; // 5 Lakhs

  // Staggered reveal animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-ink text-paper font-sans relative selection:bg-signal-blue/30 overflow-x-hidden">
      
      <FlowBackground latestEvent={latestEvent} />

      {/* Main Content Overlay */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-[1400px] mx-auto">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8 text-signal-blue" />
              <h1 className="text-3xl font-display font-bold tracking-tight text-white">
                Agent Passport
              </h1>
            </div>
            <p className="text-mist font-mono text-sm max-w-xl">
              Merchant-side policy firewall. Monitoring autonomous buyer agents in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-panel border border-steel/30 px-4 py-2 rounded-full self-start md:self-auto">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-mint' : 'bg-coral'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-mint' : 'bg-coral'}`}></span>
            </span>
            <span className="text-xs font-mono font-medium text-paper">
              {isLive ? 'SYSTEM LIVE' : 'DISCONNECTED'}
            </span>
          </div>
        </motion.header>

        {/* 3-Column Grid Layout */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Firewall Rules & Spend */}
          <div className="lg:col-span-3 space-y-8 flex flex-col">
            <motion.div variants={itemVariants}>
              <RuleStrip latestEvent={latestEvent} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SpendGauge currentSpendPaise={currentSpendPaise} capPaise={CAP_PAISE} />
            </motion.div>
          </div>

          {/* Center Column: Live Ledger (Primary Focus) */}
          <div className="lg:col-span-6">
            <motion.div variants={itemVariants} className="h-full">
              <Ledger logs={logs} />
            </motion.div>
          </div>

          {/* Right Column: Context (Agent & Catalog) */}
          <div className="lg:col-span-3 space-y-8 flex flex-col">
            <motion.div variants={itemVariants}>
              <AgentCard />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CatalogSnapshot />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default App;
