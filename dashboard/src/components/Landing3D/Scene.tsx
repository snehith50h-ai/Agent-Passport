import { Canvas, useFrame } from '@react-three/fiber';
import { ParticleSystem } from './ParticleSystem';

interface SceneProps {
  progressRef: React.MutableRefObject<number>;
  cameraZRef: React.MutableRefObject<number>;
}

function CameraController({ cameraZRef }: { cameraZRef: React.MutableRefObject<number> }) {
  useFrame((state) => {
    // Smoothly interpolate the camera Z based on the ref
    state.camera.position.z += (cameraZRef.current - state.camera.position.z) * 0.1;
  });
  return null;
}

export default function Scene({ progressRef, cameraZRef }: SceneProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-ink">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={window.devicePixelRatio > 1 ? 2 : 1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={['#070D14']} /> {/* matches ink */}
        <CameraController cameraZRef={cameraZRef} />
        <ParticleSystem count={50000} progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
