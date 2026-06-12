import { useState, useEffect } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LudoBoard from './LudoBoard';
import LudoToken from './LudoToken';
import Dice from './Dice';
import Confetti from 'react-confetti';
import { useLudoSound } from './useSound';
import { ArrowLeft, Trophy, Info } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const location = useLocation();
  const state = location.state as any;

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { playRoll, playMove, playCapture, playWin } = useLudoSound();
  const [showCaptureEffect, setShowCaptureEffect] = useState(false);
  const [actionMessage, setActionMessage] = useState('Game started! Roll the dice.');

  const opponentName = state?.opponentName || 'Opponent';

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('joinRoom', { roomId });

    socket.on('ludoGameState', (state: GameState) => {
      setGameState(state);
      setIsRolling(false);
      
      const isMyTurn = state.turn === (state.players.red === user.id ? 'red' : 'blue');
      if (state.winner) {
         setActionMessage(state.winner === (state.players.red === user.id ? 'red' : 'blue') ? 'You won!' : 'You lost!');
      } else if (state.hasRolled) {
         if (isMyTurn) setActionMessage('Select a token to move!');
         else setActionMessage('Opponent is moving a token...');
      } else {
         if (isMyTurn) setActionMessage('Your turn! Roll the dice.');
         else setActionMessage("Opponent's turn to roll.");
      }
    });

    socket.on('ludoDiceRolled', ({ diceValue }) => {
      playRoll();
      // Temporarily set value to animate the dice for BOTH players
      setGameState(prev => prev ? { ...prev, diceValue } : null);
      setIsRolling(true);
      setActionMessage('Rolling the dice...');
      
      setTimeout(() => {
        setActionMessage(`Rolled a ${diceValue}!`);
      }, 4000);

      setTimeout(() => {
        setIsRolling(false);
      }, 6000); 
    });

    socket.on('ludoTokenMoved', ({ newState, capturedIds }) => {
      setGameState(newState);
      
      if (capturedIds && capturedIds.length > 0) {
        playCapture();
        setShowCaptureEffect(true);
        setActionMessage('A token was captured!');
        setTimeout(() => setShowCaptureEffect(false), 2000);
      } else {
        playMove();
      }

      if (newState.winner) {
        playWin();
        const winnerId = newState.winner === 'red' ? newState.players.red : newState.players.blue;
        const loserId = newState.winner === 'red' ? newState.players.blue : newState.players.red;
        // Emit gameEnd once from the winner to update global leaderboard stats
        const myId = user.id || (user as any)._id;
        if (winnerId === myId) {
          socket.emit('gameEnd', {
            roomId,
            gameType: 'Ludo',
            winnerId,
            loserId,
            isDraw: false,
            duration: Date.now() - (newState.startTime || Date.now())
          });
        }
      }
    });

    return () => {
      socket.off('ludoGameState');
      socket.off('ludoDiceRolled');
      socket.off('ludoTokenMoved');
    };
  }, [socket, roomId, user, playRoll, playCapture, playMove, playWin]);

  if (!gameState || !user) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Ludo Room...</div>;
  }

  const myColor = gameState.players.red === (user.id || (user as any)._id) ? 'red' : 'blue';
  const isMyTurn = gameState.turn === myColor;

  const handleRollDice = () => {
    if (isMyTurn && !gameState.hasRolled && !isRolling && !gameState.winner) {
      socket?.emit('ludoRollDice', { roomId });
    }
  };

  const handleTokenClick = (tokenId: number) => {
    if (isMyTurn && gameState.hasRolled && !isRolling && !gameState.winner) {
      socket?.emit('ludoMoveToken', { roomId, tokenId });
    }
  };

  const isSelectable = (token: TokenState) => {
    if (!isMyTurn || !gameState.hasRolled || token.player !== myColor) return false;
    if (token.progress === 57) return false;
    if (token.progress === 0 && gameState.diceValue !== 6) return false;
    if (token.progress > 0 && token.progress + (gameState.diceValue || 0) > 57) return false;
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 p-4 text-slate-100">
      {gameState.winner && <Confetti width={windowSize.width} height={windowSize.height} />}
      {showCaptureEffect && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} colors={['#ef4444', '#3b82f6', '#facc15']} gravity={0.3} initialVelocityY={20} />}

      {/* Sidebar Area */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <button 
          onClick={() => navigate('/games')}
          className="self-start text-sm font-bold text-slate-400 hover:text-white flex items-center transition-colors bg-slate-800 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave Game
        </button>

        <div className="glass p-6 rounded-2xl border border-brand/20 shadow-2xl relative overflow-hidden neon-border-brand">
          <h2 className="text-2xl font-bold mb-6 text-white text-center flex items-center justify-center">
            <Trophy className="w-6 h-6 mr-3 text-brand" />
            Ludo Match
          </h2>

          <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl mb-4 border border-brand/10">
            <div className={`flex flex-col items-center p-3 rounded-lg w-[45%] transition-all ${isMyTurn ? 'bg-brand/20 border border-brand/50 shadow-[0_0_15px_rgba(0,112,209,0.3)]' : 'opacity-60'}`}>
              <div className={`w-10 h-10 rounded-full mb-2 border-2 border-white ${myColor === 'red' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'}`} />
              <span className="font-bold text-white">You</span>
              {isMyTurn && <span className="text-[10px] text-brand-light font-bold mt-1 tracking-widest uppercase">{gameState.hasRolled ? 'Move Token' : 'Your Turn'}</span>}
            </div>
            
            <span className="text-xl font-black text-slate-500">VS</span>
            
            <div className={`flex flex-col items-center p-3 rounded-lg w-[45%] transition-all ${!isMyTurn ? 'bg-purple-500/20 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'opacity-60'}`}>
              <div className={`w-10 h-10 rounded-full mb-2 border-2 border-white ${myColor === 'red' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`} />
              <span className="font-bold text-white">{opponentName}</span>
              {!isMyTurn && <span className="text-[10px] text-purple-300 font-bold mt-1 tracking-widest uppercase">{gameState.hasRolled ? 'Moving...' : 'Their Turn'}</span>}
            </div>
          </div>

          <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 text-center mb-6 min-h-[80px] flex items-center justify-center">
            <span className="text-sm font-medium text-slate-300">
              <Info className="w-4 h-4 inline mr-2 text-brand" />
              {actionMessage}
            </span>
          </div>

          {!gameState.winner && (
            <div className="flex flex-col items-center py-4">
              <Dice 
                value={gameState.diceValue}
                onRoll={handleRollDice}
                disabled={!isMyTurn || gameState.hasRolled || !!gameState.winner}
                isRolling={isRolling}
              />
              
              <button
                onClick={handleRollDice}
                disabled={!isMyTurn || gameState.hasRolled || isRolling}
                className={`w-full py-3 mt-4 rounded-xl font-bold transition-all uppercase tracking-widest ${
                  isMyTurn && !gameState.hasRolled && !isRolling
                    ? 'bg-gradient-to-r from-brand to-brand-hover text-white shadow-[0_0_20px_rgba(0,112,209,0.5)] hover:scale-[1.02]' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isRolling ? 'Rolling...' : isMyTurn ? (gameState.hasRolled ? 'Select Token' : 'Roll Dice') : 'Waiting...'}
              </button>
            </div>
          )}

          {gameState.winner && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-xl mt-6 text-center border-2 ${
                gameState.winner === myColor 
                  ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                  : 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              }`}
            >
              <h3 className="text-2xl font-black uppercase mb-2">
                {gameState.winner === myColor ? 'You Won!' : 'You Lost!'}
              </h3>
              <p className="text-sm opacity-80">Match stats have been recorded.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Board Area */}
      <div className="lg:w-2/3 flex items-center justify-center bg-[#0A0E17] rounded-2xl border border-slate-800 shadow-2xl p-4 lg:p-8 relative min-h-[500px]">
        <div className="relative w-full max-w-2xl aspect-square">
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
      </div>
    </div>
  );
}
