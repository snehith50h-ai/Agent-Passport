import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generateShieldPositions,
  generateMechanismPositions,
  generateFragmentedPositions,
  generateReconvergedPositions
} from './utils/geometrySamplers';

// Custom shader material for morphing particles
const vertexShader = `
  uniform float uProgress;
  uniform float uPointSize;
  
  attribute vec3 target1;
  attribute vec3 target2;
  attribute vec3 target3;
  
  varying vec3 vColor;
  
  void main() {
    vec3 currentPos = position; // Scene 1 (Shield)
    
    if (uProgress < 1.0) {
      currentPos = mix(position, target1, uProgress);
    } else if (uProgress < 2.0) {
      currentPos = mix(target1, target2, uProgress - 1.0);
    } else {
      currentPos = mix(target2, target3, clamp(uProgress - 2.0, 0.0, 1.0));
    }
    
    // Add some subtle noise/breathing based on progress/position
    currentPos.y += sin(currentPos.x * 2.0 + uProgress * 5.0) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    
    // Distance-based point size attenuation
    gl_PointSize = uPointSize * (20.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Simple color mix based on depth (Z) to give it a 3D feel
    // Mix between signal-blue #3B82F6 (0.23, 0.51, 0.96) and paper #E8ECF3 (0.91, 0.92, 0.95)
    vec3 colorBlue = vec3(0.23, 0.51, 0.96);
    vec3 colorPaper = vec3(0.91, 0.92, 0.95);
    
    // Use Z position for some color variation
    float depthMix = smoothstep(-2.0, 2.0, currentPos.z);
    vColor = mix(colorBlue, colorPaper, depthMix * 0.5);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Make particles circular with a soft edge
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.1, dist);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

interface ParticleSystemProps {
  count?: number;
  progressRef: React.MutableRefObject<number>;
}

export function ParticleSystem({ count = 10000, progressRef }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate target arrays exactly once
  const { pos0, pos1, pos2, pos3 } = useMemo(() => {
    return {
      pos0: generateShieldPositions(count),        // Scene 1: Shield
      pos1: generateMechanismPositions(count),     // Scene 2: 4 Nodes
      pos2: generateFragmentedPositions(count),    // Scene 3: Fragmented
      pos3: generateReconvergedPositions(count),   // Scene 4/5: Reconverged
    };
  }, [count]);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0.0 },
    uPointSize: { value: 1.5 }
  }), []);

  useFrame(() => {
    if (materialRef.current) {
      // Smooth out the uniform update
      materialRef.current.uniforms.uProgress.value = progressRef.current;
    }
    
    if (pointsRef.current) {
      // Gentle rotation for the whole system
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[pos0, 3]}
        />
        <bufferAttribute
          attach="attributes-target1"
          args={[pos1, 3]}
        />
        <bufferAttribute
          attach="attributes-target2"
          args={[pos2, 3]}
        />
        <bufferAttribute
          attach="attributes-target3"
          args={[pos3, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
