import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Data } from '../components/Data';

export function LandingFallback() {
  return (
    <div className="min-h-screen relative z-10 text-paper overflow-hidden">
      
      {/* Nav for Landing */}
      <nav className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50">
        <div className="font-display font-bold text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-signal-blue rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-ink rounded-full" />
          </div>
          Agent Passport
        </div>
        <Link 
          to="/console" 
          className="px-6 py-2 border border-steel/50 hover:bg-steel/20 rounded font-display uppercase tracking-wider text-sm transition-colors"
        >
          Enter Control Room
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-8 lg:px-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="font-display text-6xl lg:text-8xl font-bold leading-tight mb-8">
            Let AI buy <br/> <span className="text-mist">safely.</span>
          </h1>
          <p className="font-body text-xl lg:text-2xl text-mist max-w-2xl leading-relaxed mb-12">
            A deterministic policy firewall that sits between autonomous buyer agents and your checkout. Inspect, negotiate, and block actions in milliseconds.
          </p>
          <Link 
            to="/console" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-signal-blue text-ink rounded-lg font-display font-bold text-lg uppercase tracking-wider hover:bg-signal-blue/90 transition-colors"
          >
            Watch it live
            <div className="w-2 h-2 rounded-full bg-ink animate-pulse" />
          </Link>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section className="min-h-screen flex items-center px-8 lg:px-24 bg-ink">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-8">
            Agents are coming. <br/> Your checkout isn't ready.
          </h2>
          <p className="font-body text-xl text-mist leading-relaxed">
            LLM-driven shopping agents operate at superhuman speed, executing intent autonomously. But they can hallucinate, overspend, or ignore business logic. Without a deterministic gateway, you either block all AI traffic or risk unpredictable transactions. 
          </p>
        </motion.div>
      </section>

      {/* The Mechanism Section */}
      <section className="min-h-screen flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-4xl mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">The Pipeline</h2>
          <p className="font-body text-xl text-mist">Watch transactions flow through the deterministic gate in real-time.</p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto h-[400px] border border-steel/30 bg-panel-2/30 rounded-xl flex items-center justify-between px-12">
          {/* Base Track */}
          <div className="absolute left-12 right-12 h-1 bg-steel/30 top-1/2 -translate-y-1/2 z-0" />
          
          {/* Animated pulse traveling across the track */}
          <motion.div 
            className="absolute left-12 h-1 bg-signal-blue top-1/2 -translate-y-1/2 z-0 shadow-[0_0_15px_#3B82F6]"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 2.5, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
          />

          {/* Nodes */}
          {[
            { label: "Agent", color: "bg-mist", active: "bg-signal-blue" },
            { label: "Firewall", color: "bg-mist", active: "bg-signal-blue" },
            { label: "Payment", color: "bg-mist", active: "bg-mint" },
            { label: "Audit Log", color: "bg-mist", active: "bg-paper" }
          ].map((node, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-4 bg-panel-2/80 p-4 rounded-lg border border-steel/50 backdrop-blur-md">
              <motion.div 
                className={`w-6 h-6 rounded-full ${node.color}`}
                initial={{ backgroundColor: "#8FA0BE", scale: 1 }}
                whileInView={{ 
                  backgroundColor: ["#8FA0BE", node.active === 'bg-signal-blue' ? '#3B82F6' : node.active === 'bg-mint' ? '#22C08A' : '#E8ECF3', "#8FA0BE"],
                  scale: [1, 1.3, 1]
                }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5, delay: (i * 0.83), repeat: Infinity, repeatDelay: 3 }}
              />
              <span className="font-display font-bold uppercase tracking-wider text-sm">{node.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="min-h-screen flex items-center px-8 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 w-full">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl font-bold mb-6">Built for machine scale.</h2>
            <p className="font-body text-lg text-mist">
              Every decision is logged, mathematically evaluated against your policy config, and returned in milliseconds. Zero hallucinations in the authorization layer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {[
              { stat: "5", label: "Deterministic rules enforced" },
              { stat: "100%", label: "Of declines logged & explained" },
              { stat: "0", label: "Unauthorized payments" },
              { stat: "<200ms", label: "Average verdict time" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Data className="text-5xl font-bold text-signal-blue block mb-2">{item.stat}</Data>
                <span className="font-body text-mist text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="h-[50vh] flex flex-col items-center justify-center bg-ink border-t border-steel/30">
        <h2 className="font-display text-3xl font-bold mb-8">Ready to secure your catalog?</h2>
        <Link 
          to="/console" 
          className="px-8 py-4 border border-signal-blue text-signal-blue rounded-lg font-display font-bold uppercase tracking-wider hover:bg-signal-blue hover:text-ink transition-colors"
        >
          Enter the Control Room
        </Link>
      </section>

    </div>
  );
}
