import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKartStore } from './store';
import { Socket } from 'socket.io-client';

export interface Projectile {
  id: string;
  type: string; // 'sword', 'bomb', 'laser', 'tornado', 'banana', 'dash', 'carrot', 'slam'
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  ownerId: string;
  spawnTime: number;
  active: boolean;
}

interface WeaponManagerProps {
  socket: Socket | null;
  roomId: string;
  myId: string;
}

// Keep a module-level reference so PlayerKart can call it without re-renders
export const localWeapons = {
  projectiles: [] as Projectile[],
  fire: (type: string, position: THREE.Vector3, rotation: THREE.Euler, ownerId: string, socket: Socket | null, roomId: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const forward = new THREE.Vector3(0, 0, 1).applyEuler(rotation);
    let velocity = new THREE.Vector3();
    let yOffset = 0.5;

    // Configure projectile based on type
    switch (type) {
      case 'Sword':
        velocity.set(0, 0, 0); // Stays attached to kart (handled via position updates)
        break;
      case 'Laser':
        velocity.copy(forward).multiplyScalar(50); // Fast
        break;
      case 'Bomb':
        velocity.copy(forward).multiplyScalar(15).setY(5); // Arc
        break;
      case 'Tornado':
        velocity.copy(forward).multiplyScalar(10); // Slow wide
        break;
      case 'Banana':
        velocity.copy(forward).multiplyScalar(-5); // Toss behind
        break;
      case 'Dash':
        velocity.set(0, 0, 0); // Self-buff, no real projectile
        break;
      case 'Carrot':
        velocity.copy(forward).multiplyScalar(30);
        break;
      case 'Slam':
        velocity.set(0, 0, 0);
        break;
      default:
        velocity.copy(forward).multiplyScalar(20);
    }

    const spawnPos = position.clone().add(new THREE.Vector3(0, yOffset, 0)).add(forward.clone().multiplyScalar(2));
    if (type === 'Banana') spawnPos.copy(position).add(new THREE.Vector3(0, 0.5, 0)).add(forward.clone().multiplyScalar(-2));

    const proj: Projectile = {
      id,
      type,
      position: spawnPos,
      velocity,
      ownerId,
      spawnTime: performance.now(),
      active: true,
    };

    localWeapons.projectiles.push(proj);

    // Notify others
    if (socket) {
      socket.emit('gameMove', {
        roomId,
        moveData: {
          type: 'kart:fire_weapon',
          projectile: {
            id,
            weaponType: type,
            position: spawnPos.toArray(),
            velocity: velocity.toArray(),
            ownerId
          }
        }
      });
    }
  }
};

export default function WeaponManager({ socket, roomId, myId }: WeaponManagerProps) {
  const projectilesGroup = useRef<THREE.Group>(null);
  const meshesRef = useRef<Record<string, THREE.Mesh>>({});

  useEffect(() => {
    if (!socket) return;
    const handleMove = (data: any) => {
      if (data.type === 'kart:fire_weapon' && data.projectile.ownerId !== myId) {
        localWeapons.projectiles.push({
          id: data.projectile.id,
          type: data.projectile.weaponType,
          position: new THREE.Vector3().fromArray(data.projectile.position),
          velocity: new THREE.Vector3().fromArray(data.projectile.velocity),
          ownerId: data.projectile.ownerId,
          spawnTime: performance.now(),
          active: true,
        });
      }
    };
    socket.on('gameMove', handleMove);
    return () => {
      socket.off('gameMove', handleMove);
    };
  }, [socket, myId]);

  useFrame((_state, delta) => {
    if (!projectilesGroup.current) return;
    const now = performance.now();
    const store = useKartStore.getState();

    localWeapons.projectiles.forEach((p) => {
      if (!p.active) return;
      const age = (now - p.spawnTime) / 1000;

      // Update Physics
      if (p.type === 'Bomb') {
        p.velocity.y -= 9.8 * delta; // Gravity
      }
      
      // If sword or dash or slam, keep it attached to the owner's kart
      if (p.type === 'Sword' || p.type === 'Dash' || p.type === 'Slam') {
        if (p.ownerId === myId) {
            p.position.copy(store.position).add(new THREE.Vector3(0, 0.5, 0));
        } else {
            p.position.copy(store.opponentPosition).add(new THREE.Vector3(0, 0.5, 0));
        }
      } else {
        p.position.addScaledVector(p.velocity, delta);
      }

      // Ground collision for bomb/banana
      if (p.position.y < 0.5 && (p.type === 'Bomb' || p.type === 'Banana')) {
        p.position.y = 0.5;
        p.velocity.set(0, 0, 0);
      }

      // Hit Detection (Only shooter evaluates hit against opponent to avoid double-events)
      if (p.ownerId === myId) {
        let hitRadius = 1.5;
        if (p.type === 'Tornado' || p.type === 'Slam') hitRadius = 4.0;
        if (p.type === 'Sword') hitRadius = 2.5;

        if (store.opponentPosition.lengthSq() > 0 && p.position.distanceTo(store.opponentPosition) < hitRadius) {
          // Hit!
          p.active = false;
          if (socket) {
            socket.emit('gameMove', { roomId, moveData: { type: 'kart:weapon_hit', target: 'opponent' } });
          }
        }
      }

      // Expiration
      if (age > 3.0) { // All projectiles die after 3 seconds for now
        p.active = false;
      }

      // Update Visuals
      let mesh = meshesRef.current[p.id];
      if (!mesh && p.active) {
        // Create mesh based on type
        const geo = new THREE.SphereGeometry(0.5);
        let mat = new THREE.MeshStandardMaterial({ color: 'red' });
        
        if (p.type === 'Sword') { geo.copy(new THREE.BoxGeometry(3, 0.2, 1)); mat.color.set('silver'); }
        if (p.type === 'Laser') { geo.copy(new THREE.CylinderGeometry(0.2, 0.2, 2)); mat.color.set('red'); mat.emissive.set('red'); }
        if (p.type === 'Bomb') { geo.copy(new THREE.SphereGeometry(0.6)); mat.color.set('black'); }
        if (p.type === 'Tornado') { geo.copy(new THREE.ConeGeometry(2, 4)); mat.color.set('gray'); mat.transparent = true; mat.opacity = 0.7; }
        if (p.type === 'Banana') { geo.copy(new THREE.CylinderGeometry(0.3, 0.3, 1)); mat.color.set('yellow'); }
        if (p.type === 'Carrot') { geo.copy(new THREE.ConeGeometry(0.3, 1.5)); mat.color.set('orange'); }
        if (p.type === 'Slam') { geo.copy(new THREE.CylinderGeometry(4, 4, 0.5)); mat.color.set('brown'); mat.transparent = true; mat.opacity = 0.5; }

        mesh = new THREE.Mesh(geo, mat);
        if (projectilesGroup.current) {
          projectilesGroup.current.add(mesh);
        }
        meshesRef.current[p.id] = mesh;
      }

      if (mesh) {
        if (p.active) {
          mesh.position.copy(p.position);
          // Simple animation
          if (p.type === 'Sword') mesh.rotation.y += 20 * delta; // Spin
          if (p.type === 'Tornado') mesh.rotation.y += 10 * delta;
          if (p.type === 'Laser' || p.type === 'Carrot') {
            mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.velocity.clone().normalize());
          }
          if (p.type === 'Slam') {
             mesh.scale.setScalar(1 + age * 5); // Expand
             (mesh.material as THREE.MeshStandardMaterial).opacity = 1 - (age / 3);
          }
        } else {
          mesh.visible = false;
        }
      }
    });

    // Cleanup inactive
    localWeapons.projectiles = localWeapons.projectiles.filter(p => p.active);
  });

  return <group ref={projectilesGroup} />;
}
