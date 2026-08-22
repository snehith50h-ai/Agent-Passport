import { Canvas } from '@react-three/fiber';
import { ParticleSystem } from './ParticleSystem';

interface SceneProps {
  progressRef: React.MutableRefObject<number>;
}

export default function Scene({ progressRef }: SceneProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-ink">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={window.devicePixelRatio > 1 ? 2 : 1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={['#070D14']} /> {/* matches ink */}
        <ParticleSystem count={12000} progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
