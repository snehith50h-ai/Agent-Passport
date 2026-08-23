import React, { Suspense } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LandingFallback } from './LandingFallback';

// Lazy load the 3D version so we don't block the main bundle on unsupported devices
const Landing3D = React.lazy(() => import('../components/Landing3D/Landing3D'));

export function Landing() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <LandingFallback />;
  }

  return (
    <Suspense fallback={<LandingFallback />}>
      <Landing3D />
    </Suspense>
  );
}
