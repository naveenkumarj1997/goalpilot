import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKartStore } from './store';
import ProceduralKart from './ProceduralKart';

interface NetworkKartProps {
  character: string;
  kart: string;
}

export default function NetworkKart({ character, kart }: NetworkKartProps) {
  const group = useRef<THREE.Group>(null);
  const targetPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(new THREE.Euler());

  useEffect(() => {
    // Subscribe to Zustand store changes directly for high-perf updates without re-renders
    const unsub = useKartStore.subscribe((state) => {
      targetPosition.current.copy(state.opponentPosition);
      targetRotation.current.copy(state.opponentRotation);
    });
    return () => unsub();
  }, []);

  useFrame((_state, delta) => {
    if (!group.current) return;
    
    // Smoothly interpolate current visual position towards the network target position
    group.current.position.lerp(targetPosition.current, 10 * delta);

    // Smoothly interpolate rotation (using Quaternions for safety against gimbal lock)
    const currentQuat = new THREE.Quaternion().setFromEuler(group.current.rotation);
    const targetQuat = new THREE.Quaternion().setFromEuler(targetRotation.current);
    currentQuat.slerp(targetQuat, 10 * delta);
    group.current.rotation.setFromQuaternion(currentQuat);
  });

  return (
    <group ref={group}>
      <ProceduralKart character={character} kart={kart} />
      {/* Optional: Opponent Name Tag floating above */}
    </group>
  );
}
