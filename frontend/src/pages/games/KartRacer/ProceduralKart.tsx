import { useRef } from 'react';
import * as THREE from 'three';

interface ProceduralKartProps {
  character: string;
  kart: string;
}

const getCharacterColor = (char: string) => {
  switch(char) {
    case 'Tiger': return '#f97316'; // Orange
    case 'Fox': return '#ef4444'; // Red
    case 'Panda': return '#ffffff'; // White
    case 'Monkey': return '#8b5cf6'; // Purple
    case 'Wolf': return '#64748b'; // Slate
    case 'Rabbit': return '#f472b6'; // Pink
    case 'Bear': return '#78350f'; // Brown
    case 'Eagle': return '#eab308'; // Yellow
    default: return '#3b82f6';
  }
};

const getKartColors = (kart: string) => {
  switch(kart) {
    case 'Classic Kart': return { body: '#dc2626', detail: '#fca5a5' };
    case 'Speed Kart': return { body: '#2563eb', detail: '#60a5fa' };
    case 'Heavy Kart': return { body: '#166534', detail: '#4ade80' };
    case 'Offroad Kart': return { body: '#ca8a04', detail: '#fde047' };
    case 'Turbo Kart': return { body: '#9333ea', detail: '#d8b4fe' };
    default: return { body: '#475569', detail: '#cbd5e1' };
  }
};

export default function ProceduralKart({ character, kart }: ProceduralKartProps) {
  const charColor = getCharacterColor(character);
  const { body, detail } = getKartColors(kart);
  const group = useRef<THREE.Group>(null);

  return (
    <group ref={group}>
      {/* KART CHASSIS */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.4, 2]} />
        <meshStandardMaterial color={body} roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Front Bumper */}
      <mesh castShadow position={[0, 0.3, 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 16]} />
        <meshStandardMaterial color={detail} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Rear Spoiler */}
      <mesh castShadow position={[0, 0.8, -0.9]}>
        <boxGeometry args={[1.4, 0.1, 0.4]} />
        <meshStandardMaterial color={detail} />
      </mesh>
      <mesh castShadow position={[-0.5, 0.65, -0.9]}>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <meshStandardMaterial color={body} />
      </mesh>
      <mesh castShadow position={[0.5, 0.65, -0.9]}>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <meshStandardMaterial color={body} />
      </mesh>

      {/* WHEELS */}
      {/* Front Left */}
      <mesh castShadow position={[-0.7, 0.3, 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      {/* Front Right */}
      <mesh castShadow position={[0.7, 0.3, 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      {/* Rear Left */}
      <mesh castShadow position={[-0.7, 0.3, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      {/* Rear Right */}
      <mesh castShadow position={[0.7, 0.3, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>

      {/* DRIVER (Procedural Voxel-ish) */}
      <group position={[0, 0.6, -0.2]}>
        {/* Body */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.5]} />
          <meshStandardMaterial color={charColor} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={charColor} />
        </mesh>
        {/* Eyes (Goggles) */}
        <mesh position={[0, 0.85, 0.26]}>
          <boxGeometry args={[0.4, 0.15, 0.05]} />
          <meshStandardMaterial color="#22d3ee" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Steering Wheel */}
        <mesh position={[0, 0.4, 0.4]} rotation={[-Math.PI / 6, 0, 0]}>
          <torusGeometry args={[0.25, 0.05, 8, 24]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}
