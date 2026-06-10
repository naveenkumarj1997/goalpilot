import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';
import KartSelection from './KartSelection';
import TrackSelection from './TrackSelection';
import Engine from './Engine';

export default function KartRacer() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  const state = location.state as any;

  if (!state || !user) {
    navigate('/games');
    return null;
  }

  const [phase, setPhase] = useState<'kart_select' | 'track_select' | 'racing'>('kart_select');
  
  // Selections
  const [myCharacter, setMyCharacter] = useState<string>('');
  const [myKart, setMyKart] = useState<string>('');
  const [myReady, setMyReady] = useState(false);
  
  const [opponentCharacter, setOpponentCharacter] = useState<string>('');
  const [opponentKart, setOpponentKart] = useState<string>('');
  const [opponentReady, setOpponentReady] = useState(false);
  
  const [selectedTrack, setSelectedTrack] = useState<number>(0);

  const isHost = state.iAmStarter;
  const opponentId = state.opponentId;

  useEffect(() => {
    if (!socket || !roomId) return;
    
    // Ensure room joined
    socket.emit('joinRoom', { roomId });

    socket.on('gameMove', (data: any) => {
      if (data.type === 'kart:init') {
        setOpponentCharacter(data.character);
        setOpponentKart(data.kart);
        setOpponentReady(true);
      }
      
      if (data.type === 'kart:track_select') {
        setSelectedTrack(data.track);
        setPhase('racing');
      }
    });

    return () => {
      socket.off('gameMove');
    };
  }, [socket, roomId]);

  // Transition to track select if both ready
  useEffect(() => {
    if (myReady && opponentReady && phase === 'kart_select') {
      if (isHost) {
        setPhase('track_select');
      } else {
        // Non-host just waits for track to be selected
        setPhase('track_select');
      }
    }
  }, [myReady, opponentReady, phase, isHost]);

  const handleLockIn = (character: string, kart: string) => {
    setMyCharacter(character);
    setMyKart(kart);
    setMyReady(true);
    
    socket?.emit('gameMove', {
      roomId,
      moveData: { type: 'kart:init', character, kart }
    });
  };

  const handleTrackSelect = (trackId: number) => {
    setSelectedTrack(trackId);
    setPhase('racing');
    
    socket?.emit('gameMove', {
      roomId,
      moveData: { type: 'kart:track_select', track: trackId }
    });
  };

  if (phase === 'kart_select') {
    return (
      <KartSelection 
        onLockIn={handleLockIn} 
        isReady={myReady} 
        opponentReady={opponentReady} 
        opponentName={state.opponentName} 
      />
    );
  }

  if (phase === 'track_select') {
    return (
      <TrackSelection 
        isHost={isHost} 
        onSelect={handleTrackSelect} 
        opponentName={state.opponentName} 
      />
    );
  }

  return (
    <Engine 
      roomId={roomId!}
      opponentId={opponentId}
      opponentName={state.opponentName}
      myCharacter={myCharacter}
      myKart={myKart}
      opponentCharacter={opponentCharacter}
      opponentKart={opponentKart}
      trackId={selectedTrack}
      isHost={isHost}
    />
  );
}
