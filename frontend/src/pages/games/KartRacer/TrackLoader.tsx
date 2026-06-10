import { useMemo } from 'react';
import * as THREE from 'three';
import { trackCurve, TRACK_WIDTH } from './trackCurve';

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

  // Generate road geometry using TubeGeometry for robust orientation
  const roadGeometry = useMemo(() => {
    // We create a tube of radius TRACK_WIDTH, but we will scale it on the Y axis by 0.01 
    // to flatten it into a perfect road without normal twisting issues.
    return new THREE.TubeGeometry(trackCurve, 200, TRACK_WIDTH, 8, true);
  }, []);

  // Generate guardrail geometries
  const [leftRailGeo, rightRailGeo] = useMemo(() => {
    // Since the road is a scaled tube, the guardrails can also be tubes offset along the normal
    // But for simplicity, we can just render two more TubeGeometries and offset their scales/positions
    // Actually, TubeGeometry centers exactly on the curve. 
    return [
      new THREE.TubeGeometry(trackCurve, 200, TRACK_WIDTH + 1, 8, true),
      new THREE.TubeGeometry(trackCurve, 200, TRACK_WIDTH + 1.5, 8, true)
    ];
  }, []);

  // Generate side decorations
  const decorations = useMemo(() => {
    const decs = [];
    // Spawn 300 random trees/rocks around the map
    for(let i=0; i<300; i++) {
      const x = (Math.random() - 0.5) * 450;
      const z = (Math.random() - 0.5) * 450;
      
      // Don't spawn ON the road. Check distance to curve.
      let tooClose = false;
      const point = new THREE.Vector3(x, 0, z);
      const points = trackCurve.getPoints(100);
      for(let p of points) {
        if (p.distanceTo(point) < TRACK_WIDTH + 5) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        decs.push({
          position: [x, 0, z] as [number, number, number],
          scale: Math.random() * 2 + 1.5,
          type: Math.random() > 0.5 ? 'tree' : 'rock'
        });
      }
    }
    return decs;
  }, []);

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

      {/* The Drivable Road - BLACK ASPHALT */}
      <mesh geometry={roadGeometry} receiveShadow scale={[1, 0.01, 1]}>
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>

      {/* Guardrails */}
      <mesh geometry={leftRailGeo} castShadow receiveShadow scale={[1, 0.05, 1]}>
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>
      <mesh geometry={rightRailGeo} castShadow receiveShadow scale={[1, 0.05, 1]}>
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Starting Line */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRACK_WIDTH * 2, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Starting Arch */}
      <mesh position={[-TRACK_WIDTH, 10, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 20]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[TRACK_WIDTH, 10, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 20]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 20, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1, 1, TRACK_WIDTH * 2]} />
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
