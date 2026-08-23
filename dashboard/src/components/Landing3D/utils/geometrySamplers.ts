import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

function sampleGeometry(geometry: THREE.BufferGeometry, count: number, transform?: THREE.Matrix4): Float32Array {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  if (transform) {
    mesh.applyMatrix4(transform);
    mesh.updateMatrixWorld();
  }

  const sampler = new MeshSurfaceSampler(mesh).build();
  const position = new THREE.Vector3();
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    sampler.sample(position);
    points[i * 3] = position.x;
    points[i * 3 + 1] = position.y;
    points[i * 3 + 2] = position.z;
  }
  return points;
}

export function generateLogoPositions(count: number): Float32Array {
  // A hexagonal cylinder approximates a shield/logo for Agent Passport
  const geom = new THREE.CylinderGeometry(3, 3, 0.5, 6, 1, false);
  geom.rotateX(Math.PI / 2); // Stand it up
  geom.rotateZ(Math.PI / 6); // Pointy side down
  return sampleGeometry(geom, count);
}

export function generateSpherePositions(count: number): Float32Array {
  // A massive sphere
  const geom = new THREE.SphereGeometry(6, 64, 64);
  return sampleGeometry(geom, count);
}

export function generateClusterPositions(count: number): Float32Array {
  // 4 distinct dense node clusters
  const counts = [
    Math.floor(count * 0.25),
    Math.floor(count * 0.25),
    Math.floor(count * 0.25),
    count - (Math.floor(count * 0.25) * 3)
  ];

  const points = new Float32Array(count * 3);
  let offset = 0;

  const R = 8; // Spread them far apart

  const positions = [
    new THREE.Vector3(-R, R, 0),
    new THREE.Vector3(R, R, 0),
    new THREE.Vector3(-R, -R, 0),
    new THREE.Vector3(R, -R, 0)
  ];

  for (let i = 0; i < 4; i++) {
    const g = new THREE.SphereGeometry(1.5, 32, 32);
    const m = new THREE.Matrix4().makeTranslation(positions[i].x, positions[i].y, positions[i].z);
    const pts = sampleGeometry(g, counts[i], m);
    points.set(pts, offset);
    offset += pts.length;
  }

  return points;
}

export function generateLinePositions(count: number): Float32Array {
  // Particles arranged in lines from the 4 corners to the center
  const points = new Float32Array(count * 3);
  
  const R = 8;
  const origins = [
    new THREE.Vector3(-R, R, 0),
    new THREE.Vector3(R, R, 0),
    new THREE.Vector3(-R, -R, 0),
    new THREE.Vector3(R, -R, 0)
  ];
  const center = new THREE.Vector3(0, 0, 0);

  for (let i = 0; i < count; i++) {
    const origin = origins[i % 4];
    // Interpolate from origin to center with some noise
    const t = Math.random();
    
    // Concentrate more towards the center
    const easedT = Math.pow(t, 2); 
    
    const pos = origin.clone().lerp(center, easedT);
    
    // Add thin scatter to make it look like glowing beams
    pos.x += (Math.random() - 0.5) * 0.2;
    pos.y += (Math.random() - 0.5) * 0.2;
    pos.z += (Math.random() - 0.5) * 0.2;
    
    points[i * 3] = pos.x;
    points[i * 3 + 1] = pos.y;
    points[i * 3 + 2] = pos.z;
  }
  
  return points;
}

export function generateGridPositions(count: number): Float32Array {
  // 2D flat grid
  const points = new Float32Array(count * 3);
  
  const gridSize = Math.ceil(Math.sqrt(count));
  const spacing = 0.2;
  const offset = (gridSize * spacing) / 2;

  for (let i = 0; i < count; i++) {
    const x = (i % gridSize) * spacing - offset;
    const y = Math.floor(i / gridSize) * spacing - offset;
    
    // Lay it down on the XZ plane and shift it down to act as a floor
    points[i * 3] = x;
    points[i * 3 + 1] = -4; // Shift down
    points[i * 3 + 2] = y;
  }

  return points;
}
