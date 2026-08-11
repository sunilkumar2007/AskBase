import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const MAGENTA = '#CB2958';

interface Node {
  name: string;
  pos: [number, number, number];
}

export function SchemaWorld({ visible = true }: { visible?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);

  const nodes: Node[] = useMemo(() => [
    { name: 'CUSTOMERS', pos: [-2, 1, 0] },
    { name: 'ORDERS', pos: [0, 0, 0] },
    { name: 'PRODUCTS', pos: [2, 1, 0] },
    { name: 'INVENTORY', pos: [2, -1, 0] },
    { name: 'PAYMENTS', pos: [-2, -1, 0] },
  ], []);

  const connections: [number, number][] = useMemo(() => [
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 4],
  ], []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

      // Strict state-based visibility to prevent flickering/leaking between sections
      const targetOpacity = visible ? 1 : 0;
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 15);

      // Hard visibility cutoff: only render if visible is true AND opacity is rising,
      // or if it's already well into the transition.
      groupRef.current.visible = visible && opacityRef.current > 0.01;

      // Ensure it's fully gone when not explicitly requested
      if (!visible) {
        groupRef.current.visible = false;
        opacityRef.current = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <SchemaNode key={i} node={node} opacityRef={opacityRef} />
      ))}

      {connections.map(([startIdx, endIdx], i) => {
        const startPos = nodes[startIdx]?.pos;
        const endPos = nodes[endIdx]?.pos;

        if (!startPos || !endPos) return null;

        return (
          <Connection
            key={i}
            start={startPos}
            end={endPos}
            opacityRef={opacityRef}
          />
        );
      })}
    </group>
  );
}

function SchemaNode({ node, opacityRef }: { node: Node; opacityRef: React.MutableRefObject<number> }) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const textRef = useRef<any>(null);

  useFrame(() => {
    if (materialRef.current) materialRef.current.opacity = opacityRef.current;
    if (textRef.current) textRef.current.fillOpacity = opacityRef.current;
  });

  return (
    <group position={node.pos}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh>
          <boxGeometry args={[1.5, 0.5, 0.1]} />
          <meshStandardMaterial
            ref={materialRef}
            color="white"
            metalness={0.1}
            roughness={0.8}
            transparent
          />
        </mesh>
        <Text
          ref={textRef}
          position={[0, 0, 0.06]}
          fontSize={0.1}
          color="#18181B"
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
        >
          {node.name}
        </Text>
      </Float>
    </group>
  );
}

function Connection({ start, end, opacityRef }: { start: [number, number, number], end: [number, number, number], opacityRef: React.MutableRefObject<number> }) {
  const p1 = useMemo(() => new THREE.Vector3(...start), [start]);
  const p2 = useMemo(() => new THREE.Vector3(...end), [end]);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const center = useMemo(() => new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5), [p1, p2]);
  const direction = useMemo(() => new THREE.Vector3().subVectors(p2, p1), [p1, p2]);
  const length = useMemo(() => direction.length(), [direction]);

  useFrame(() => {
    if (materialRef.current) materialRef.current.opacity = opacityRef.current * 0.3;
  });

  return (
    <group position={center.toArray() as [number, number, number]}>
      <mesh rotation={[0, 0, Math.atan2(direction.y, direction.x)]}>
        <boxGeometry args={[length, 0.01, 0.01]} />
        <meshStandardMaterial ref={materialRef} color="#E4E4E7" transparent opacity={0.3} />
      </mesh>
      <Pulse start={p1} end={p2} opacityRef={opacityRef} />
    </group>
  );
}

function Pulse({ start, end, opacityRef }: { start: THREE.Vector3, end: THREE.Vector3, opacityRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const position = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (meshRef.current) {
      const t = (state.clock.elapsedTime * 0.5) % 1;
      position.lerpVectors(start, end, t);
      const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const localPos = new THREE.Vector3().subVectors(position, center);
      meshRef.current.position.copy(localPos);
    }
    if (materialRef.current) {
      materialRef.current.opacity = opacityRef.current;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial ref={materialRef} color={MAGENTA} emissive={MAGENTA} emissiveIntensity={2} transparent />
    </mesh>
  );
}
