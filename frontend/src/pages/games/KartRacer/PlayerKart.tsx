import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKartStore } from './store';
import ProceduralKart from './ProceduralKart';
import { Socket } from 'socket.io-client';
import { trackCurve, TRACK_WIDTH } from './trackCurve';

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
  const maxSpeed = 10; // Significantly reduced per user request
  const acceleration = 5; // Reduced proportional to max speed
  const friction = 5;
  const turnSpeed = 2.0; // Slightly reduced turn speed to match lower speed

  // Crash State
  const crashTimer = useRef(0);
  const initialZRotation = useRef(0);

  // Network sync throttle
  const lastSync = useRef(0);

  // Initialize position immediately on mount
  const isInitialized = useRef(false);
  useEffect(() => {
    if (group.current) {
      group.current.position.copy(useKartStore.getState().position);
      group.current.rotation.copy(useKartStore.getState().rotation);
      isInitialized.current = true;
    }
  }, []);

  useFrame((_state, delta) => {
    if (!group.current) return;

    // Merge physical keyboard and mobile on-screen controls inside the frame loop
    // so we always get the latest state without relying on React renders
    const mobileControls = useKartStore.getState().mobileControls;
    const activeKeys = {
      forward: keys.forward || mobileControls.forward,
      backward: keys.backward || mobileControls.backward,
      left: keys.left || mobileControls.left,
      right: keys.right || mobileControls.right,
      drift: keys.drift || mobileControls.drift,
      useItem: keys.useItem || mobileControls.useItem,
    };

    if (gameState === 'racing') {
      if (crashTimer.current > 0) {
        // Crash Animation (Flip in place)
        crashTimer.current -= delta;
        velocity.current = 0;
        group.current.rotation.z += 15 * delta;
        
        // When flip is over, reset rotation
        if (crashTimer.current <= 0) {
          group.current.rotation.z = initialZRotation.current;
        }
      } else {
        // Collision Detection with Opponent
        const oppPos = useKartStore.getState().opponentPosition;
        if (oppPos.lengthSq() > 0 && group.current.position.distanceTo(oppPos) < 1.8) {
          crashTimer.current = 1.0; // 1 second crash duration
          initialZRotation.current = group.current.rotation.z;
          velocity.current = 0; // Stop immediately
        }

        // Acceleration
        if (activeKeys.forward) velocity.current += acceleration * delta;
        else if (activeKeys.backward) velocity.current -= acceleration * delta;
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
          if (activeKeys.left) group.current.rotation.y += turnSpeed * delta * turnDir;
          if (activeKeys.right) group.current.rotation.y -= turnSpeed * delta * turnDir;
        }

        // Movement
        const moveVec = new THREE.Vector3(0, 0, 1).applyEuler(group.current.rotation);
        const nextPos = group.current.position.clone().addScaledVector(moveVec, velocity.current * delta);

        // Track Boundary Constraint
        // Find nearest point on the track curve
        const points = trackCurve.getPoints(100);
        let minDistance = Infinity;
        let closestPoint = points[0];
        
        for(let i=0; i<points.length; i++) {
          const dist = nextPos.distanceTo(points[i]);
          if(dist < minDistance) {
            minDistance = dist;
            closestPoint = points[i];
          }
        }

        // If we are about to go off the road (beyond TRACK_WIDTH)
        if (minDistance > TRACK_WIDTH) {
          // Hard bounce / stop
          velocity.current *= -0.5; // Bounce back
          // Push slightly back towards the closest valid point
          const pushDir = closestPoint.clone().sub(nextPos).normalize();
          nextPos.addScaledVector(pushDir, minDistance - TRACK_WIDTH + 1);
        }

        group.current.position.copy(nextPos);
      }
    }

    // Camera follow (chase cam)
    const isMobile = window.innerWidth < 768;
    const idealOffset = isMobile ? new THREE.Vector3(0, 7, -16) : new THREE.Vector3(0, 3, -8);
    idealOffset.applyEuler(group.current.rotation);
    idealOffset.add(group.current.position);
    
    camera.position.lerp(idealOffset, 5 * delta);
    camera.lookAt(group.current.position.clone().add(new THREE.Vector3(0, 1, 0)));

    // Update Zustand only if racing or countdown to avoid overwriting initial positions
    if (gameState === 'racing' || gameState === 'countdown') {
      setLocalState({
        position: group.current.position.clone(),
        rotation: group.current.rotation.clone(),
        speed: velocity.current,
      });
    }

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
