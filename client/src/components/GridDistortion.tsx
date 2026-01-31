import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Particles() {
  const count = 3000; // Increased density for high-end feel
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Create a grid of points
  const particles = useMemo(() => {
    const temp = [];
    const size = 60; // Spread
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = Math.random() * size - size / 2;
      const y = Math.random() * size - size / 2;
      const z = Math.random() * size - size / 2;
      temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Mouse interaction - convert normalized coordinates to world space approx
    const time = state.clock.getElapsedTime();
    const { pointer, viewport } = state;
    const mx = (pointer.x * viewport.width) / 2;
    const my = (pointer.y * viewport.height) / 2;

    particles.forEach((particle, i) => {
      let { t, factor, speed, x, y, z } = particle;

      // Vertical flow movement
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Mouse repulsion/attraction effect
      const dx = mx - x;
      const dy = my - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Distortion logic
      const distortion = Math.max(0, 5 - dist / 3); 
      
      dummy.position.set(
        x + (Math.cos(t) * 0.5) + (dx / dist) * distortion,
        y + (Math.sin(t) * 0.5) + (dy / dist) * distortion,
        z + (Math.sin(t) * 0.5)
      );
      
      const scale = (s > 0 ? s : -s) * 0.08; // Small, refined points
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#444444" emissive="#000000" shininess={50} />
      </instancedMesh>
    </>
  );
}

export function GridDistortion() {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#080808', 10, 30]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#ffffff" intensity={1} />
        <Particles />
      </Canvas>
    </div>
  );
}
