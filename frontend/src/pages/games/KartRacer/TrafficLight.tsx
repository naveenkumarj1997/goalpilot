import { useKartStore } from './store';

export default function TrafficLight() {
  const { gameState, countdown } = useKartStore();

  if (gameState !== 'countdown' && gameState !== 'racing') return null;
  // Hide traffic light after racing has been going on for a bit
  if (gameState === 'racing' && countdown < -2) return null;

  return (
    <group position={[0, 5, 20]} rotation={[0, Math.PI, 0]}>
      {/* Post */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 10]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Light Box */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[2, 6, 1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Red Light (3) */}
      <mesh position={[0, 4.5, 0.6]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
        <meshStandardMaterial 
          color={countdown === 3 ? "#ef4444" : "#450a0a"} 
          emissive={countdown === 3 ? "#ef4444" : "#000000"} 
          emissiveIntensity={countdown === 3 ? 2 : 0} 
        />
      </mesh>

      {/* Yellow Light (2) */}
      <mesh position={[0, 3, 0.6]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
        <meshStandardMaterial 
          color={countdown === 2 ? "#eab308" : "#422006"} 
          emissive={countdown === 2 ? "#eab308" : "#000000"} 
          emissiveIntensity={countdown === 2 ? 2 : 0} 
        />
      </mesh>

      {/* Green Light (1 / GO) */}
      <mesh position={[0, 1.5, 0.6]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
        <meshStandardMaterial 
          color={countdown <= 1 ? "#22c55e" : "#052e16"} 
          emissive={countdown <= 1 ? "#22c55e" : "#000000"} 
          emissiveIntensity={countdown <= 1 ? 2 : 0} 
        />
      </mesh>
    </group>
  );
}
