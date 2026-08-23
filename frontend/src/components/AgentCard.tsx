import { Bot } from 'lucide-react';
import { Panel } from './Panel';
import { Data } from './Data';

export function AgentCard() {
  return (
    <Panel className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-signal-blue/20 border border-signal-blue flex items-center justify-center text-signal-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-mist text-xs font-semibold uppercase tracking-wider font-display">
            Connected Agent
          </h2>
          <Data className="text-paper text-sm">agent_alpha_9x</Data>
        </div>
      </div>
      
      <div className="space-y-4 font-mono">
        <div className="flex justify-between items-center text-xs">
          <span className="text-mist">Status</span>
          <span className="text-mint flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            Active
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs border-t border-steel/30 pt-4">
          <span className="text-mist">Model</span>
          <span className="text-paper font-body">GPT-4 Turbo</span>
        </div>
        
        <div className="flex justify-between items-center text-xs border-t border-steel/30 pt-4">
          <span className="text-mist">Protocol</span>
          <span className="text-paper font-body">Agent Passport TCP/IP</span>
        </div>
      </div>
    </Panel>
  );
}
