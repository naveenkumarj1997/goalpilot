import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKartStore } from './store';
import ProceduralKart from './ProceduralKart';
import { Socket } from 'socket.io-client';

interface PlayerKartProps {
  character: string;
  kart: string;
  socket: Socket | null;
  roomId: string;
}

const useKeyboard = () => {
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false, drift: false, useItem: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(k => ({ ...k, forward: true }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(k => ({ ...k, backward: true }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: true }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: true }));
      if (e.code === 'Space') setKeys(k => ({ ...k, drift: true }));
      if (e.code === 'KeyE') setKeys(k => ({ ...k, useItem: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(k => ({ ...k, forward: false }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(k => ({ ...k, backward: false }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(k => ({ ...k, left: false }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(k => ({ ...k, right: false }));
      if (e.code === 'Space') setKeys(k => ({ ...k, drift: false }));
      if (e.code === 'KeyE') setKeys(k => ({ ...k, useItem: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

export default function PlayerKart({ character, kart, socket, roomId }: PlayerKartProps) {
  const group = useRef<THREE.Group>(null);
  const keys = useKeyboard();
  const { camera } = useThree();
  const setLocalState = useKartStore(state => state.setLocalState);
  const gameState = useKartStore(state => state.gameState);

  // Physics state
  const velocity = useRef(0);
  const maxSpeed = 100;
  const acceleration = 40;
  const friction = 20;
  const turnSpeed = 2.5;

  // Network sync throttle
  const lastSync = useRef(0);

  useFrame((_state, delta) => {
    if (!group.current) return;

    if (gameState === 'racing') {
      // Acceleration
      if (keys.forward) velocity.current += acceleration * delta;
      else if (keys.backward) velocity.current -= acceleration * delta;
      else {
        // Friction
        if (velocity.current > 0) velocity.current = Math.max(0, velocity.current - friction * delta);
        if (velocity.current < 0) velocity.current = Math.min(0, velocity.current + friction * delta);
      }

      // Cap speed
      velocity.current = THREE.MathUtils.clamp(velocity.current, -maxSpeed / 2, maxSpeed);

      // Steering
      // Only steer if moving
      if (Math.abs(velocity.current) > 1) {
        const turnDir = velocity.current > 0 ? 1 : -1;
        if (keys.left) group.current.rotation.y += turnSpeed * delta * turnDir;
        if (keys.right) group.current.rotation.y -= turnSpeed * delta * turnDir;
      }

      // Movement
      const moveVec = new THREE.Vector3(0, 0, 1).applyEuler(group.current.rotation);
      group.current.position.addScaledVector(moveVec, velocity.current * delta);
    }

    // Camera follow (chase cam)
    const idealOffset = new THREE.Vector3(0, 3, -8);
    idealOffset.applyEuler(group.current.rotation);
    idealOffset.add(group.current.position);
    
    camera.position.lerp(idealOffset, 5 * delta);
    camera.lookAt(group.current.position.clone().add(new THREE.Vector3(0, 1, 0)));

    // Update Zustand
    setLocalState({
      position: group.current.position.clone(),
      rotation: group.current.rotation.clone(),
      speed: velocity.current,
    });

    // Network Sync (20Hz)
    const now = performance.now();
    if (now - lastSync.current > 50 && socket && gameState === 'racing') {
      socket.emit('gameMove', {
        roomId,
        moveData: {
          type: 'kart:sync',
          position: group.current.position.toArray(),
          rotation: group.current.rotation.toArray(),
          speed: velocity.current,
        }
      });
      lastSync.current = now;
    }
  });

  return (
    <group ref={group}>
      <ProceduralKart character={character} kart={kart} />
    </group>
  );
}
