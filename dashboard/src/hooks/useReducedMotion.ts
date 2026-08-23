import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const onChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', onChange);
    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  // Also heuristically check for low-end hardware
  const isLowEnd = 
    (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) < 4) ||
    (typeof window !== 'undefined' && !window.WebGL2RenderingContext);

  return prefersReducedMotion || isLowEnd;
}
