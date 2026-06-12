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
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 p-4 text-slate-800 min-h-[90vh]">
      {gameState.winner && <Confetti width={windowSize.width} height={windowSize.height} />}
      {showCaptureEffect && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} colors={['#ef4444', '#3b82f6', '#facc15']} gravity={0.3} initialVelocityY={20} />}

      {/* Sidebar Area */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <button 
          onClick={() => navigate('/games')}
          className="self-start text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave Game
        </button>

        <div className="bg-white p-6 rounded-2xl border-b-4 border-slate-200 shadow-xl relative overflow-hidden">
          <h2 className="text-2xl font-black mb-6 text-slate-800 text-center flex items-center justify-center tracking-wide uppercase">
            <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
            Ludo Match
          </h2>

          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200 shadow-inner">
            <div className={`flex flex-col items-center p-3 rounded-lg w-[45%] transition-all ${isMyTurn ? 'bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border-b-4 border-brand' : 'opacity-60'}`}>
              <div className={`w-12 h-12 rounded-full mb-2 border-4 border-white shadow-md ${myColor === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`} />
              <span className="font-bold text-slate-800">You</span>
              {isMyTurn && <span className="text-[10px] text-brand font-black mt-1 tracking-widest uppercase">{gameState.hasRolled ? 'Move Token' : 'Your Turn'}</span>}
            </div>
            
            <span className="text-xl font-black text-slate-300">VS</span>
            
            <div className={`flex flex-col items-center p-3 rounded-lg w-[45%] transition-all ${!isMyTurn ? 'bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border-b-4 border-purple-500' : 'opacity-60'}`}>
              <div className={`w-12 h-12 rounded-full mb-2 border-4 border-white shadow-md ${myColor === 'red' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`} />
              <span className="font-bold text-slate-800">{opponentName}</span>
              {!isMyTurn && <span className="text-[10px] text-purple-500 font-black mt-1 tracking-widest uppercase">{gameState.hasRolled ? 'Moving...' : 'Their Turn'}</span>}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center mb-6 min-h-[80px] flex items-center justify-center shadow-inner">
            <span className="text-sm font-bold text-amber-900">
              <Info className="w-5 h-5 inline mr-2 text-amber-500" />
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
                className={`w-full py-4 mt-6 rounded-xl font-black text-lg transition-all uppercase tracking-widest ${
                  isMyTurn && !gameState.hasRolled && !isRolling
                    ? 'bg-gradient-to-b from-brand to-blue-700 text-white shadow-[0_6px_0_#1e3a8a,0_15px_20px_rgba(0,0,0,0.2)] active:translate-y-[6px] active:shadow-[0_0px_0_#1e3a8a,0_5px_10px_rgba(0,0,0,0.2)]' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-4 border-slate-300'
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
              className={`p-6 rounded-xl mt-6 text-center border-b-4 ${
                gameState.winner === myColor 
                  ? 'bg-green-50 border-green-200 text-green-700 shadow-xl' 
                  : 'bg-red-50 border-red-200 text-red-700 shadow-xl'
              }`}
            >
              <h3 className="text-2xl font-black uppercase mb-2">
                {gameState.winner === myColor ? 'You Won!' : 'You Lost!'}
              </h3>
              <p className="text-sm font-medium opacity-80">Match stats have been recorded.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Board Area - The "Table" */}
      <div className="lg:w-2/3 flex items-center justify-center bg-[#f8fafc] rounded-3xl border border-slate-200 shadow-[inset_0_0_50px_rgba(0,0,0,0.05)] p-4 lg:p-8 relative min-h-[500px]"
           style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
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
