import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { useKartStore } from './store';
import PlayerKart from './PlayerKart';
import NetworkKart from './NetworkKart';
import TrackLoader from './TrackLoader';
import MysteryBox from './MysteryBox';
import GameUI from './GameUI';
import MatchResults from './MatchResults';

interface EngineProps {
  roomId: string;
  opponentId: string;
  opponentName: string;
  myCharacter: string;
  myKart: string;
  opponentCharacter: string;
  opponentKart: string;
  trackId: number;
  isHost: boolean;
}

export default function Engine({
  roomId, opponentId, opponentName, 
  myCharacter, myKart, opponentCharacter, opponentKart, 
  trackId, isHost
}: EngineProps) {
  const { socket } = useSocket();
  
  const setLocalState = useKartStore(state => state.setLocalState);
  const setOpponentState = useKartStore(state => state.setOpponentState);
  const gameState = useKartStore(state => state.gameState);
  const { user } = useAuth();
  const myId = user?._id || '';

  // Match Results State local to UI
  const winnerRef = useRef<string | null>(null);

  useEffect(() => {
    // Initial Setup
    setLocalState({
      position: new THREE.Vector3(isHost ? -5 : 5, 0.5, 0),
      rotation: new THREE.Euler(0, 0, 0),
      gameState: 'countdown',
      countdown: 3,
      raceTime: 0,
      lap: 1
    });

    setOpponentState({
      opponentPosition: new THREE.Vector3(isHost ? 5 : -5, 0.5, 0),
      opponentRotation: new THREE.Euler(0, 0, 0)
    });

    // Countdown Timer
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setLocalState({ countdown: count });
      if (count <= 0) {
        clearInterval(interval);
        setLocalState({ gameState: 'racing' });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Race Timer
  useEffect(() => {
    let timer: any;
    if (gameState === 'racing') {
      const start = Date.now();
      timer = setInterval(() => {
        setLocalState({ raceTime: Date.now() - start });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Socket Listener
  useEffect(() => {
    if (!socket) return;

    socket.on('gameMove', (data: any) => {
      if (data.type === 'kart:sync') {
        setOpponentState({
          opponentPosition: new THREE.Vector3(data.position[0], data.position[1], data.position[2]),
          opponentRotation: new THREE.Euler(data.rotation[0], data.rotation[1], data.rotation[2]),
          opponentSpeed: data.speed
        });
      }

      if (data.type === 'kart:finish') {
        winnerRef.current = data.winnerId;
        setLocalState({ gameState: 'finished' });
      }
    });

    return () => {
      socket.off('gameMove');
    };
  }, [socket]);

  // Dummy Lap Logic (Check Z-crossing for now)
  useEffect(() => {
    const checkLap = setInterval(() => {
      const { position, lap, gameState, raceTime } = useKartStore.getState();
      if (gameState === 'racing' && position.z > 90 && position.z < 100) {
        // Simple hack: if z crosses 90 -> 100 range going forward.
        // In a real game, we'd need checkpoints to prevent turning around.
        if (lap < 3) {
          setLocalState({ lap: lap + 1, position: new THREE.Vector3(position.x, position.y, 110) }); // Teleport slightly to prevent double trigger
        } else {
          // Finished
          setLocalState({ gameState: 'finished' });
          winnerRef.current = myId;
          socket?.emit('gameMove', { roomId, moveData: { type: 'kart:finish', winnerId: myId } });
          socket?.emit('gameEnd', { roomId, gameType: 'KartRacer', winnerId: myId, loserId: opponentId, isDraw: false, duration: raceTime });
        }
      }
    }, 500);
    return () => clearInterval(checkLap);
  }, []);

  return (
    <div className="w-full h-screen relative bg-black">
      {gameState === 'finished' && (
        <MatchResults 
          winnerId={winnerRef.current!} 
          opponentId={opponentId} 
          opponentName={opponentName} 
          myId={myId} 
          raceTime={useKartStore.getState().raceTime}
        />
      )}
      
      <GameUI />

      <Canvas shadows camera={{ fov: 60 }}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[100, 100, 50]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          shadow-camera-far={500} 
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <TrackLoader trackId={trackId} />

        <PlayerKart character={myCharacter} kart={myKart} socket={socket} roomId={roomId} />
        <NetworkKart character={opponentCharacter} kart={opponentKart} />

        {/* Spread some mystery boxes around */}
        <MysteryBox id="box1" position={[0, 1, 50]} socket={socket} roomId={roomId} />
        <MysteryBox id="box2" position={[-20, 1, 100]} socket={socket} roomId={roomId} />
        <MysteryBox id="box3" position={[20, 1, 100]} socket={socket} roomId={roomId} />
      </Canvas>
    </div>
  );
}
