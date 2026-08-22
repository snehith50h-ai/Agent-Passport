import { useMemo } from 'react';

export function useSpendGauge(currentSpendPaise: number, capPaise: number) {
  return useMemo(() => {
    // Ensure we don't divide by zero
    const safeCap = capPaise > 0 ? capPaise : 1;
    
    // Calculate the percentage strictly capped at 100%
    const percentage = Math.min((currentSpendPaise / safeCap) * 100, 100);
    
    // The number to display is just the current spend
    const displaySpend = currentSpendPaise / 100;
    
    const capRupees = capPaise / 100;
    const isNearCap = percentage > 80;
    
    return {
      percentage,
      displaySpend,
      capRupees,
      isNearCap
    };
  }, [currentSpendPaise, capPaise]);
}
