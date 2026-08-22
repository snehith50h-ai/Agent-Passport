import type { ReactNode } from 'react';

export function Data({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <span className={`font-mono ${className}`}>
      {children}
    </span>
  );
}
