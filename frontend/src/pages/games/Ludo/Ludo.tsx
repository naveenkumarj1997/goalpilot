import { useState, useEffect } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import LudoBoard from './LudoBoard';
import LudoToken from './LudoToken';
import Dice from './Dice';
import Confetti from 'react-confetti';
import { useLudoSound } from './useSound';

interface TokenState {
  id: number;
  player: 'red' | 'blue';
  progress: number;
}

interface GameState {
  players: { red: string; blue: string };
  turn: 'red' | 'blue';
  diceValue: number | null;
  hasRolled: boolean;
  tokens: TokenState[];
  winner: string | null;
}

export default function Ludo() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { playRoll, playMove, playCapture, playWin } = useLudoSound();
  const [showCaptureEffect, setShowCaptureEffect] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', { roomId });

    socket.on('ludoGameState', (state: GameState) => {
      setGameState(state);
      setIsRolling(false);
    });

    socket.on('ludoDiceRolled', ({ diceValue }) => {
      playRoll();
      // Set value immediately so Dice can animate towards it over 6 seconds
      setGameState(prev => prev ? { ...prev, diceValue } : null);
      setIsRolling(true);
      setTimeout(() => {
        setIsRolling(false);
        setGameState(prev => prev ? { ...prev, hasRolled: true } : null);
      }, 6000); // 6s realistic response
    });

    socket.on('ludoTokenMoved', ({ newState, capturedIds }) => {
      setGameState(newState);
      
      if (capturedIds && capturedIds.length > 0) {
        playCapture();
        setShowCaptureEffect(true);
        setTimeout(() => setShowCaptureEffect(false), 2000);
      } else {
        playMove();
      }

      if (newState.winner) {
        playWin();
      }
    });

    socket.on('gameEnd', () => {
      // In Ludo, the server sends winner state inside ludoTokenMoved as well
    });

    return () => {
      socket.off('ludoGameState');
      socket.off('ludoDiceRolled');
      socket.off('ludoTokenMoved');
      socket.off('gameEnd');
    };
  }, [socket, roomId]);

  if (!gameState) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Ludo Room...</div>;
  }

  const myColor = gameState.players.red === (user?.id || user?._id) ? 'red' : 'blue';
  const isMyTurn = gameState.turn === myColor;

  const handleRollDice = () => {
    if (isMyTurn && !gameState.hasRolled && !isRolling) {
      socket?.emit('ludoRollDice', { roomId });
    }
  };

  const handleTokenClick = (tokenId: number) => {
    if (isMyTurn && gameState.hasRolled && !isRolling) {
      socket?.emit('ludoMoveToken', { roomId, tokenId });
    }
  };

  // Compute selectable tokens purely for visual hover states (backend still validates)
  const isSelectable = (token: TokenState) => {
    if (!isMyTurn || !gameState.hasRolled || token.player !== myColor) return false;
    if (token.progress === 57) return false;
    if (token.progress === 0 && gameState.diceValue !== 6) return false;
    if (token.progress > 0 && token.progress + (gameState.diceValue || 0) > 57) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row items-center justify-center p-4 gap-8">
      {gameState.winner && <Confetti width={windowSize.width} height={windowSize.height} />}
      {showCaptureEffect && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} colors={['#ef4444', '#3b82f6', '#facc15']} gravity={0.3} initialVelocityY={20} />}

      {/* Opponent UI & Chat */}
      <div className="flex flex-col gap-4 w-full md:w-64 h-full max-h-[600px]">
        <div className="flex flex-col items-center gap-4 p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-xl font-bold mb-2 flex items-center text-slate-200">
            Opponent
          </h3>
          <div className={`px-4 py-2 rounded-full font-bold text-sm ${!isMyTurn && !gameState.winner ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
            {!isMyTurn && !gameState.winner ? "THEIR TURN" : "WAITING"}
          </div>
        </div>
      </div>

      {/* Center Board */}
      <div className="relative w-full max-w-2xl">
        <LudoBoard />
        
        {/* Render Tokens */}
        {gameState.tokens.map(token => (
          <LudoToken
            key={`${token.player}-${token.id}`}
            id={token.id}
            player={token.player}
            progress={token.progress}
            isActiveTurn={gameState.turn === token.player}
            isSelectable={isSelectable(token)}
            onClick={handleTokenClick}
          />
        ))}
      </div>

      {/* Player UI */}
      <div className="flex flex-col items-center gap-6 p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 w-full md:w-64 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-1">YOU</h2>
          <div className={`px-4 py-2 rounded-full font-bold text-sm ${isMyTurn && !gameState.winner ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
            {isMyTurn ? "YOUR TURN" : "WAITING"}
          </div>
        </div>

        <Dice 
          value={gameState.turn === myColor ? gameState.diceValue : null}
          onRoll={handleRollDice}
          disabled={!isMyTurn || gameState.hasRolled || !!gameState.winner}
          isRolling={isRolling}
        />

        {gameState.winner && (
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/40 rounded-2xl border border-yellow-500/50 text-center animate-bounce">
            <h1 className="text-3xl font-black text-yellow-400 drop-shadow-md">
              {gameState.winner === myColor ? 'VICTORY!' : 'DEFEAT'}
            </h1>
            <button onClick={() => navigate('/games')} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors">
              Exit to Lounge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
