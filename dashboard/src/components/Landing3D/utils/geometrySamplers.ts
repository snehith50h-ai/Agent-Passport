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

export function generateShieldPositions(count: number): Float32Array {
  // A hexagonal cylinder approximates a shield
  const geom = new THREE.CylinderGeometry(2, 2, 0.5, 6, 1, false);
  geom.rotateX(Math.PI / 2); // Stand it up
  geom.rotateZ(Math.PI / 6); // Pointy side down
  return sampleGeometry(geom, count);
}

export function generateMechanismPositions(count: number): Float32Array {
  // 4 nodes: Icosahedron, Box, Torus, Sphere
  // We divide the count into 4
  const counts = [
    Math.floor(count * 0.25),
    Math.floor(count * 0.25),
    Math.floor(count * 0.25),
    count - (Math.floor(count * 0.25) * 3)
  ];

  const points = new Float32Array(count * 3);
  let offset = 0;

  const R = 3.5; // Orbit radius
  
  // 1. Agent (Icosahedron)
  const g1 = new THREE.IcosahedronGeometry(0.8, 0);
  const m1 = new THREE.Matrix4().makeTranslation(-R, 0, 0);
  const pts1 = sampleGeometry(g1, counts[0], m1);
  points.set(pts1, offset);
  offset += pts1.length;

  // 2. Catalog (Box)
  const g2 = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const m2 = new THREE.Matrix4().makeTranslation(0, R, 0);
  const pts2 = sampleGeometry(g2, counts[1], m2);
  points.set(pts2, offset);
  offset += pts2.length;

  // 3. Firewall (Torus)
  const g3 = new THREE.TorusGeometry(0.8, 0.3, 16, 32);
  const m3 = new THREE.Matrix4().makeTranslation(R, 0, 0);
  const pts3 = sampleGeometry(g3, counts[2], m3);
  points.set(pts3, offset);
  offset += pts3.length;

  // 4. Audit Log (Sphere)
  const g4 = new THREE.SphereGeometry(0.8, 16, 16);
  const m4 = new THREE.Matrix4().makeTranslation(0, -R, 0);
  const pts4 = sampleGeometry(g4, counts[3], m4);
  points.set(pts4, offset);

  return points;
}

export function generateFragmentedPositions(count: number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Large bounding box, noisy
    points[i * 3] = (Math.random() - 0.5) * 20;
    points[i * 3 + 1] = (Math.random() - 0.5) * 20;
    points[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }
  return points;
}

export function generateReconvergedPositions(count: number): Float32Array {
  // Center shield + orbiting nodes
  const shieldCount = Math.floor(count * 0.5);
  const mechanismCount = count - shieldCount;

  const shieldPts = generateShieldPositions(shieldCount);
  const mechPts = generateMechanismPositions(mechanismCount);

  const points = new Float32Array(count * 3);
  points.set(shieldPts, 0);
  points.set(mechPts, shieldPts.length);

  return points;
}
