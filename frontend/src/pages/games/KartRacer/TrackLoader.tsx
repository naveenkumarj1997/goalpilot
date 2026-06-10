

interface TrackLoaderProps {
  trackId: number;
}

const getTrackTheme = (id: number) => {
  switch(id) {
    case 0: return { ground: '#fef08a', wall: '#16a34a', sky: '#38bdf8' }; // Tropical
    case 1: return { ground: '#451a03', wall: '#dc2626', sky: '#7f1d1d' }; // Volcano
    case 2: return { ground: '#e0f2fe', wall: '#3b82f6', sky: '#bae6fd' }; // Snow
    case 3: return { ground: '#d97706', wall: '#b45309', sky: '#fcd34d' }; // Desert
    case 4: return { ground: '#064e3b', wall: '#14532d', sky: '#6ee7b7' }; // Jungle
    default: return { ground: '#333333', wall: '#666666', sky: '#87CEEB' };
  }
};

export default function TrackLoader({ trackId }: TrackLoaderProps) {
  const theme = getTrackTheme(trackId);

  // Very simple procedurally generated track for now (a massive stadium floor and walls)
  // In a full production game, this would load a GLTF model.
  
  return (
    <group>
      {/* Sky/Background Color */}
      <color attach="background" args={[theme.sky]} />
      <fog attach="fog" args={[theme.sky, 50, 200]} />

      {/* Main Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color={theme.ground} roughness={0.8} />
      </mesh>

      {/* Track Boundary Walls (Simple Arena for now) */}
      <mesh position={[0, 5, -100]} receiveShadow castShadow>
        <boxGeometry args={[200, 10, 2]} />
        <meshStandardMaterial color={theme.wall} />
      </mesh>
      <mesh position={[0, 5, 100]} receiveShadow castShadow>
        <boxGeometry args={[200, 10, 2]} />
        <meshStandardMaterial color={theme.wall} />
      </mesh>
      <mesh position={[-100, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 10, 200]} />
        <meshStandardMaterial color={theme.wall} />
      </mesh>
      <mesh position={[100, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 10, 200]} />
        <meshStandardMaterial color={theme.wall} />
      </mesh>

      {/* Starting Line */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Starting Arch */}
      <mesh position={[-20, 10, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 20]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[20, 10, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 20]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 20, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1, 1, 40]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Decorative Obstacles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[(Math.random() - 0.5) * 150, 5, (Math.random() - 0.5) * 150]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[5, 10, 5]} />
          <meshStandardMaterial color={theme.wall} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
