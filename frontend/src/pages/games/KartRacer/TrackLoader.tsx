import { useMemo } from 'react';
import * as THREE from 'three';

interface TrackLoaderProps {
  trackId: number;
}

const getTrackTheme = (id: number) => {
  switch(id) {
    case 0: return { ground: '#fef08a', wall: '#16a34a', sky: '#38bdf8', road: '#334155' }; // Tropical
    case 1: return { ground: '#451a03', wall: '#dc2626', sky: '#7f1d1d', road: '#1e293b' }; // Volcano
    case 2: return { ground: '#e0f2fe', wall: '#3b82f6', sky: '#bae6fd', road: '#94a3b8' }; // Snow
    case 3: return { ground: '#d97706', wall: '#b45309', sky: '#fcd34d', road: '#475569' }; // Desert
    case 4: return { ground: '#064e3b', wall: '#14532d', sky: '#6ee7b7', road: '#1e293b' }; // Jungle
    default: return { ground: '#333333', wall: '#666666', sky: '#87CEEB', road: '#333333' };
  }
};

export default function TrackLoader({ trackId }: TrackLoaderProps) {
  const theme = getTrackTheme(trackId);

  // Generate a procedural racing track curve (Figure-8 like)
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 80),
      new THREE.Vector3(50, 0, 150),
      new THREE.Vector3(120, 0, 150),
      new THREE.Vector3(180, 0, 80),
      new THREE.Vector3(180, 0, -80),
      new THREE.Vector3(120, 0, -150),
      new THREE.Vector3(50, 0, -150),
      new THREE.Vector3(0, 0, -80),
    ], true); // true = closed loop
  }, []);

  // Generate road geometry by extruding a flat shape along the curve
  const roadGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Flat road cross-section (width: 30)
    shape.moveTo(-15, 0.1);
    shape.lineTo(15, 0.1);
    
    return new THREE.ExtrudeGeometry(shape, {
      extrudePath: curve,
      steps: 200,
      bevelEnabled: false,
    });
  }, [curve]);

  // Generate side decorations
  const decorations = useMemo(() => {
    const decs = [];
    // Spawn 100 random trees/rocks around the map
    for(let i=0; i<150; i++) {
      const x = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      
      // Don't spawn ON the road. Check distance to curve.
      // We do a simple bounding box check here to avoid complex math in render loop
      let tooClose = false;
      const point = new THREE.Vector3(x, 0, z);
      const points = curve.getPoints(50);
      for(let p of points) {
        if (p.distanceTo(point) < 25) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        decs.push({
          position: [x, 0, z] as [number, number, number],
          scale: Math.random() * 2 + 1,
          type: Math.random() > 0.5 ? 'tree' : 'rock'
        });
      }
    }
    return decs;
  }, [curve]);

  return (
    <group>
      {/* Sky & Fog */}
      <color attach="background" args={[theme.sky]} />
      <fog attach="fog" args={[theme.sky, 50, 250]} />

      {/* Main Ground (Outside Road) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color={theme.ground} roughness={1} />
      </mesh>

      {/* The Drivable Road */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial color={theme.road} roughness={0.9} />
      </mesh>

      {/* Starting Line */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Starting Arch */}
      <mesh position={[-15, 10, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 20]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[15, 10, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 20]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 20, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1, 1, 30]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Decorations */}
      {decorations.map((dec, i) => (
        <group key={i} position={dec.position} scale={dec.scale}>
          {dec.type === 'tree' ? (
            <group>
              <mesh position={[0, 2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.5, 0.5, 4]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              <mesh position={[0, 6, 0]} castShadow receiveShadow>
                <coneGeometry args={[3, 8, 5]} />
                <meshStandardMaterial color={theme.wall} />
              </mesh>
            </group>
          ) : (
            <mesh position={[0, 1, 0]} castShadow receiveShadow rotation={[Math.random(), Math.random(), 0]}>
              <dodecahedronGeometry args={[2]} />
              <meshStandardMaterial color="#64748b" roughness={0.8} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
