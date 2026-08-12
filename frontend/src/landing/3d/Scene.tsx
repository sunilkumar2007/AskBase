import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { IntelligenceCore } from './IntelligenceCore';

export interface SceneProps {
  activeStage?: string;
  scrollProgress?: number;
}

export function Scene({ activeStage = 'hero', scrollProgress = 0 }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />

          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#CB2958" />

          <CameraController scrollProgress={scrollProgress} />
          <IntelligenceCore activeStage={activeStage} scrollProgress={scrollProgress} />

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />
          <directionalLight position={[5, 5, 5]} intensity={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  useFrame((state) => {
    const targetZ = 5 - scrollProgress * 3;
    const targetY = scrollProgress * 1;
    const targetX = scrollProgress * 0.5;

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
