import { Bot, Activity } from 'lucide-react';

export function AgentCard() {
  return (
    <div className="bg-panel/60 backdrop-blur-md border border-steel/50 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
      
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-signal-blue/10 rounded-full blur-2xl group-hover:bg-signal-blue/20 transition-colors" />

      <h2 className="text-mist text-xs font-semibold uppercase tracking-wider mb-6 font-mono flex items-center gap-2">
        <Bot className="w-4 h-4" />
        Connected Agent
      </h2>

      <div className="space-y-4 relative z-10">
        <div>
          <p className="text-xs text-mist font-mono mb-1">Identity</p>
          <p className="text-paper text-lg font-display">ProcureBot v2.4</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-steel/30">
          <div>
            <p className="text-xs text-mist font-mono mb-1">Session ID</p>
            <p className="text-paper text-xs font-mono">agent_alpha_9x</p>
          </div>
          <div>
            <p className="text-xs text-mist font-mono mb-1">Status</p>
            <div className="flex items-center gap-1 text-mint text-xs font-mono">
              <Activity className="w-3 h-3" />
              Active
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-mist font-mono mb-1">Protocol</p>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-panel-2 border border-steel/30 text-[10px] text-paper font-mono uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-blue"></span>
            Agent Passport TCP/IP
          </div>
        </div>
      </div>
    </div>
  );
}
