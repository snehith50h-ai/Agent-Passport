import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div 
      className={`relative rounded-xl border border-steel/30 shadow-2xl overflow-hidden bg-slate-900/40 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
