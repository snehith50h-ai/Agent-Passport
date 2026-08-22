import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div 
      className={`relative rounded-xl border border-steel/60 shadow-2xl overflow-hidden ${className}`}
      style={{ 
        background: 'rgba(16, 30, 51, 0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}
