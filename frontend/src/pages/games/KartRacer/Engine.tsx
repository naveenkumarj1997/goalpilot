import { useEffect, useRef, useCallback, useState } from 'react';
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
import TrafficLight from './TrafficLight';

// Component that fires once the 3D scene is mounted
function SceneReadyNotifier({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // Small delay to ensure shaders are somewhat compiled before starting countdown
    const t = setTimeout(onReady, 1000);
    return () => clearTimeout(t);
  }, [onReady]);
  return null;
}

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
    // Initial Setup - Set to loading initially
    setLocalState({
      position: new THREE.Vector3(isHost ? -5 : 5, 0.5, 0),
      rotation: new THREE.Euler(0, 0, 0),
      gameState: 'loading',
      countdown: 3,
      raceTime: 0,
      lap: 1
    });

    setOpponentState({
      opponentPosition: new THREE.Vector3(isHost ? 5 : -5, 0.5, 0),
      opponentRotation: new THREE.Euler(0, 0, 0)
    });
  }, [isHost]);

  const [localReady, setLocalReady] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);

  const handleSceneReady = useCallback(() => {
    if (useKartStore.getState().gameState !== 'loading' || localReady) return;
    setLocalReady(true);
    socket?.emit('gameMove', { roomId, moveData: { type: 'kart:scene_ready' } });
  }, [socket, roomId, localReady]);

  useEffect(() => {
    if (localReady && remoteReady && useKartStore.getState().gameState === 'loading') {
      setLocalState({ gameState: 'countdown' });
      let count = 3;
      const interval = setInterval(() => {
        count--;
        setLocalState({ countdown: count });
        if (count <= 0) {
          clearInterval(interval);
          setLocalState({ gameState: 'racing' });
        }
      }, 1000);
    }
  }, [localReady, remoteReady, setLocalState]);

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

      if (data.type === 'kart:scene_ready') {
        setRemoteReady(true);
      }
    });

    return () => {
      socket.off('gameMove');
    };
  }, [socket]);

  // Realistic Lap Logic (Check crossing the starting line + checkpoint)
  const checkpointPassed = useRef(false);

  useEffect(() => {
    const checkLap = setInterval(() => {
      const { position, lap, gameState, raceTime } = useKartStore.getState();
      
      // Checkpoint is on the far right side of the figure-8 track (x > 150)
      if (gameState === 'racing' && position.x > 150) {
        checkpointPassed.current = true;
      }

      // The start line is at position [0, 0, 0] with the track going towards +Z initially.
      // So if Z crosses from negative to positive while X is roughly between -15 and 15, we completed a lap.
      // We only allow a lap if the player has passed the halfway checkpoint.
      if (gameState === 'racing' && checkpointPassed.current && position.z > 0 && position.z < 10 && position.x > -20 && position.x < 20) {
        if (lap < 3) {
          setLocalState({ lap: lap + 1, position: new THREE.Vector3(position.x, position.y, 15) }); // Teleport slightly to prevent double trigger
          checkpointPassed.current = false; // Reset checkpoint for the next lap
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

      {gameState === 'loading' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-white text-3xl font-black italic animate-pulse tracking-widest">
            LOADING TRACK...
          </div>
        </div>
      )}

      <Canvas shadows camera={{ fov: 60, position: [0, 4, -10] }}>
        <SceneReadyNotifier onReady={handleSceneReady} />
        
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
        <TrafficLight />

        <PlayerKart character={myCharacter} kart={myKart} socket={socket} roomId={roomId} />
        <NetworkKart character={opponentCharacter} kart={opponentKart} />

        {/* Spread some mystery boxes around the new track */}
        <MysteryBox id="box1" position={[85, 1, 150]} socket={socket} roomId={roomId} />
        <MysteryBox id="box2" position={[180, 1, 0]} socket={socket} roomId={roomId} />
        <MysteryBox id="box3" position={[85, 1, -150]} socket={socket} roomId={roomId} />
      </Canvas>
    </div>
  );
}
