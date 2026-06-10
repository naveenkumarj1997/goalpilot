import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKartStore } from './store';
import { Socket } from 'socket.io-client';

interface MysteryBoxProps {
  id: string;
  position: [number, number, number];
  socket: Socket | null;
  roomId: string;
}

export default function MysteryBox({ id, position, socket, roomId }: MysteryBoxProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(true);
  
  const setLocalState = useKartStore(state => state.setLocalState);
  const playerPos = useKartStore(state => state.position);

  useFrame((state, delta) => {
    if (!mesh.current || !active) return;
    
    // Spin animation
    mesh.current.rotation.x += delta;
    mesh.current.rotation.y += delta;
    
    // Hover animation
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.5;

    // Collision detection (Simple distance check)
    const boxPos = new THREE.Vector3(position[0], mesh.current.position.y, position[2]);
    if (playerPos.distanceTo(boxPos) < 3.0) {
      setActive(false); // Hide box
      
      // Grant random powerup
      const powerups = ['Speed Boost', 'Rocket Projectile', 'Shield', 'Mine Trap'];
      const randomPower = powerups[Math.floor(Math.random() * powerups.length)];
      setLocalState({ powerup: randomPower });

      // Notify server to hide box for opponent
      if (socket) {
        socket.emit('gameMove', {
          roomId,
          moveData: { type: 'kart:box_collected', boxId: id }
        });
      }

      // Respawn after 10 seconds
      setTimeout(() => setActive(true), 10000);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={mesh} position={position} castShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial 
        color="#a855f7" 
        emissive="#a855f7" 
        emissiveIntensity={0.5} 
        transparent 
        opacity={0.8} 
        wireframe
      />
      {/* Inner solid core */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
    </mesh>
  );
}
