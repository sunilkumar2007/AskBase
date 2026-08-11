import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLandingStore } from '@/stores/useLandingStore';
import { SchemaWorld } from './SchemaWorld';

const MAGENTA = '#CB2958';

export function IntelligenceCore() {
  const scrollProgress = useLandingStore((state) => state.scrollProgress);
  const activeStage = useLandingStore((state) => state.activeStage);
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Dynamic values based on scroll
  const rotationSpeed = useMemo(() => 0.5 + scrollProgress * 2, [scrollProgress]);

  const coreOpacity = useMemo(() => {
    if (activeStage === 'hero' || activeStage === 'ask') return 1;
    return 0.1;
  }, [activeStage]);


  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed * 0.5;
      meshRef.current.rotation.z += delta * rotationSpeed * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.8;
      ringRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <group ref={meshRef} visible={coreOpacity > 0}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.8, 32]} />
          <meshStandardMaterial
            color="#18181B"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={coreOpacity}
          />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.7, 32]} />
          <meshStandardMaterial
            color={MAGENTA}
            emissive={MAGENTA}
            emissiveIntensity={2}
            transparent
            opacity={0.3 * coreOpacity}
          />
        </mesh>

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={ringRef}>
            <torusGeometry args={[1.2, 0.02, 16, 100]} />
            <meshStandardMaterial
              color={MAGENTA}
              emissive={MAGENTA}
              emissiveIntensity={1}
              transparent
              opacity={coreOpacity}
            />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.01, 16, 100]} />
            <meshStandardMaterial
              color="#18181B"
              transparent
              opacity={0.2 * coreOpacity}
            />
          </mesh>
        </Float>

        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} index={i} opacity={coreOpacity} />
        ))}
      </group>

      <group scale={0.7} position={[0, 0, -1]}>
        <SchemaWorld visible={activeStage === 'understanding'} />
      </group>

    </group>
  );
}

function Particle({ index, opacity }: { index: number; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const randomFactor = useMemo(() => Math.random(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = (index / 20) * Math.PI * 2 + time * 0.2;
    const radius = 1.5 + Math.sin(time * 0.5 + index) * 0.2;

    if (ref.current) {
      ref.current.position.x = Math.cos(angle) * radius;
      ref.current.position.y = Math.sin(angle * 0.5) * radius;
      ref.current.position.z = Math.sin(angle) * radius;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial
        color={randomFactor > 0.7 ? MAGENTA : "#18181B"}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}
