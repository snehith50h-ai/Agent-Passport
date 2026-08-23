import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generateLogoPositions,
  generateSpherePositions,
  generateClusterPositions,
  generateLinePositions,
  generateGridPositions
} from './utils/geometrySamplers';

// Custom shader material for morphing particles
const vertexShader = `
  uniform float uProgress;
  uniform float uPointSize;
  
  attribute vec3 target1;
  attribute vec3 target2;
  attribute vec3 target3;
  attribute vec3 target4;
  
  varying vec3 vColor;
  
  void main() {
    vec3 currentPos = position; // Scene 1 (Logo)
    
    if (uProgress < 1.0) {
      currentPos = mix(position, target1, uProgress);
    } else if (uProgress < 2.0) {
      currentPos = mix(target1, target2, uProgress - 1.0);
    } else if (uProgress < 3.0) {
      currentPos = mix(target2, target3, uProgress - 2.0);
    } else {
      currentPos = mix(target3, target4, clamp(uProgress - 3.0, 0.0, 1.0));
    }
    
    // Add some subtle noise/breathing based on progress/position
    currentPos.y += sin(currentPos.x * 2.0 + uProgress * 5.0) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    
    // Distance-based point size attenuation
    gl_PointSize = uPointSize * (20.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Electric blue (#2962FF) to neon cyan (#00E5FF)
    vec3 colorBlue = vec3(0.16, 0.38, 1.0); // #2962FF
    vec3 colorCyan = vec3(0.0, 0.9, 1.0);   // #00E5FF
    
    // Use Z position and index/X for color variation
    float depthMix = smoothstep(-4.0, 4.0, currentPos.z + currentPos.x * 0.5);
    vColor = mix(colorBlue, colorCyan, depthMix);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Make particles circular with a soft edge
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.1, dist);
    // Extra glow near center
    float glow = smoothstep(0.3, 0.0, dist);
    
    gl_FragColor = vec4(vColor + vec3(glow * 0.5), alpha * 0.9);
  }
`;

interface ParticleSystemProps {
  count?: number;
  progressRef: React.MutableRefObject<number>;
}

export function ParticleSystem({ count = 50000, progressRef }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate target arrays exactly once
  const { pos0, pos1, pos2, pos3, pos4 } = useMemo(() => {
    return {
      pos0: generateLogoPositions(count),
      pos1: generateSpherePositions(count),
      pos2: generateClusterPositions(count),
      pos3: generateLinePositions(count),
      pos4: generateGridPositions(count),
    };
  }, [count]);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0.0 },
    uPointSize: { value: 1.5 }
  }), []);

  useFrame(() => {
    if (materialRef.current) {
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
        <bufferAttribute attach="attributes-position" args={[pos0, 3]} />
        <bufferAttribute attach="attributes-target1" args={[pos1, 3]} />
        <bufferAttribute attach="attributes-target2" args={[pos2, 3]} />
        <bufferAttribute attach="attributes-target3" args={[pos3, 3]} />
        <bufferAttribute attach="attributes-target4" args={[pos4, 3]} />
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
