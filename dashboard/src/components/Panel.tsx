import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div 
      className={`relative rounded-xl border border-[rgba(43,68,104,0.6)] bg-[rgba(16,30,51,0.55)] shadow-2xl overflow-hidden backdrop-blur-[20px] ${className}`}
      style={{ WebkitBackdropFilter: 'blur(20px)' }}
    >
      {children}
    </div>
  );
}
