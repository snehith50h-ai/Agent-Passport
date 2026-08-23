import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div 
      className={`relative rounded-xl shadow-premium overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-steel/20 ${className}`}
    >
      {children}
    </div>
  );
}
