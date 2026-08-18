import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

const ParticleSystem = () => {
  const pointsRef = useRef();
  
  const particlesCount = 3000;
  
  const [positions, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const size = new Float32Array(particlesCount);
    const rnd = new Float32Array(particlesCount);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      size[i] = Math.random() * 2;
      rnd[i] = Math.random();
    }
    return [pos, size, rnd];
  }, []);

  const stateRef = useRef({ scrollPhase: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (pointsRef.current) {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        stateRef.current.scrollPhase = scrollPercent;
        
        gsap.to(pointsRef.current.rotation, {
          z: scrollPercent * Math.PI * 2, // Slowed down from 4 to 2
          duration: 1.5,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const scrollPhase = stateRef.current.scrollPhase;
      
      // Base rotation (slowed down)
      pointsRef.current.rotation.y += 0.001 + (scrollPhase * 0.002);
      pointsRef.current.rotation.x += 0.0005;
      
      // Subtle clustering and breathing
      // As scrollPhase increases towards 1 (Final CTA), the particles converge
      const scaleBase = 1 - (scrollPhase * 0.5); // Shrink as we go down
      const breathing = Math.sin(state.clock.elapsedTime * (1 + scrollPhase * 2)) * 0.05;
      const finalScale = scaleBase + breathing;
      
      pointsRef.current.scale.set(finalScale, finalScale, finalScale);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const CareerParticles = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export default CareerParticles;
