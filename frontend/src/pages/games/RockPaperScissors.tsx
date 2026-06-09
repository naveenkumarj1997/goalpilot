import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, ArrowLeft, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Choice = 'rock' | 'paper' | 'scissors' | null;

const MOVES = {
  rock: { emoji: '✊', beats: 'scissors', label: 'Rock' },
  paper: { emoji: '✋', beats: 'rock', label: 'Paper' },
  scissors: { emoji: '✌️', beats: 'paper', label: 'Scissors' },
};

export default function RockPaperScissors() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const state = location.state as any; 
  // { gameType, format, opponentName, opponentId, iAmStarter }

  const targetScore = state?.format === 'bo5' ? 3 : state?.format === 'bo3' ? 2 : 1;

  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);

  const [roundStatus, setRoundStatus] = useState<'selecting' | 'revealing' | 'round_over' | 'match_over'>('selecting');
  
  const [myChoice, setMyChoice] = useState<Choice>(null);
  const [opChoice, setOpChoice] = useState<Choice>(null);
  const [opLocked, setOpLocked] = useState(false);
  
  const [countdown, setCountdown] = useState(7);
  const [roundWinner, setRoundWinner] = useState<'me' | 'opponent' | 'draw' | null>(null);
  const [matchWinner, setMatchWinner] = useState<'me' | 'opponent' | null>(null);
  const [rematchRequested, setRematchRequested] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!socket || !roomId || !state || !user) {
      navigate('/games');
      return;
    }

    socket.emit('joinRoom', { roomId });

    startRound();

    socket.on('rpsOpponentLocked', () => {
      setOpLocked(true);
    });

    socket.on('rpsReveal', (movesObj: any) => {
      handleReveal(movesObj);
    });

    socket.on('rematchRequestedByOpponent', () => {
      //
    });

    socket.on('rematchStart', () => {
      setMyScore(0);
      setOpScore(0);
      setMatchWinner(null);
      setRematchRequested(false);
      startRound();
    });

    return () => {
      socket.off('rpsOpponentLocked');
      socket.off('rpsReveal');
      socket.off('rematchRequestedByOpponent');
      socket.off('rematchStart');
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [socket, roomId, user]);

  const startRound = () => {
    setRoundStatus('selecting');
    setMyChoice(null);
    setOpChoice(null);
    setOpLocked(false);
    setRoundWinner(null);
    setCountdown(7);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Auto-select if time runs out
    if (countdown === 0 && roundStatus === 'selecting') {
      if (!myChoice && socket) {
        // Pick a random move
        const randomMoves: Choice[] = ['rock', 'paper', 'scissors'];
        const random = randomMoves[Math.floor(Math.random() * randomMoves.length)];
        handleChoice(random);
      }
    }
  }, [countdown, roundStatus]);

  const handleChoice = (choice: Choice) => {
    if (roundStatus !== 'selecting' || myChoice) return;
    setMyChoice(choice);
    socket?.emit('rpsMove', { roomId, move: choice });
  };

  const handleReveal = (movesObj: any) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const mine = movesObj[user?._id];
    const ops = movesObj[state.opponentId];

    setMyChoice(mine);
    setOpChoice(ops);
    setRoundStatus('revealing');

    // Wait a brief moment for dramatic effect before showing result
    setTimeout(() => {
      calculateRound(mine, ops);
    }, 1500);
  };

  const calculateRound = (mine: Choice, ops: Choice) => {
    let rWinner: 'me' | 'opponent' | 'draw' = 'draw';
    let newMyScore = myScore;
    let newOpScore = opScore;

    if (mine === ops) {
      rWinner = 'draw';
    } else if (mine && ops && MOVES[mine].beats === ops) {
      rWinner = 'me';
      newMyScore += 1;
      setMyScore(newMyScore);
    } else {
      rWinner = 'opponent';
      newOpScore += 1;
      setOpScore(newOpScore);
    }

    setRoundWinner(rWinner);

    if (newMyScore >= targetScore || newOpScore >= targetScore) {
      setRoundStatus('match_over');
      const mWinner = newMyScore >= targetScore ? 'me' : 'opponent';
      setMatchWinner(mWinner);

      if (mWinner === 'me' && socket) {
        socket.emit('gameEnd', {
          roomId,
          gameType: 'RockPaperScissors',
          winnerId: user?._id,
          loserId: state.opponentId,
          isDraw: false,
          duration: 0
        });
      }
    } else {
      setRoundStatus('round_over');
      setTimeout(() => {
        startRound();
      }, 3000); // 3 seconds before next round starts
    }
  };

  const requestRematch = () => {
    if (!socket) return;
    setRematchRequested(true);
    socket.emit('rematchRequest', { roomId });
  };

  if (!state) return null;

  return (
    <div className="max-w-5xl mx-auto min-h-[600px] md:h-[800px] flex flex-col text-slate-100 bg-slate-900 p-4 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" />

      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => navigate('/games')} className="flex items-center text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5 mr-2" /> Leave Match
        </button>
      </div>

      <div className="text-center mb-8 relative z-10 pt-6">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 tracking-wider">
          ROCK PAPER SCISSORS
        </h1>
        <div className="text-slate-400 font-bold uppercase tracking-widest mt-2">
          {state.format === 'bo5' ? 'Best of 5' : state.format === 'bo3' ? 'Best of 3' : 'Single Round'}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="flex justify-center items-center gap-4 sm:gap-12 mb-8 sm:mb-16 relative z-10">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-slate-300">{user?.name}</span>
          <div className="text-6xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">{myScore}</div>
        </div>
        
        <div className="flex flex-col gap-2">
          {Array.from({ length: targetScore }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < Math.max(myScore, opScore) ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-slate-700'}`} />
          ))}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-slate-300">{state.opponentName}</span>
          <div className="text-6xl font-black text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]">{opScore}</div>
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* Opponent Side */}
        <div className="mb-12 flex flex-col items-center">
          <span className="text-slate-500 font-bold mb-4 uppercase tracking-widest">Opponent</span>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-slate-800 border-2 border-slate-700 shadow-xl flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {roundStatus === 'selecting' && !opLocked && (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-4xl animate-pulse">🤔</motion.div>
              )}
              {roundStatus === 'selecting' && opLocked && (
                <motion.div key="locked" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-400">
                  <RefreshCw className="w-10 h-10 animate-spin" />
                </motion.div>
              )}
              {roundStatus !== 'selecting' && opChoice && (
                <motion.div 
                  key="reveal" 
                  initial={{ rotateY: 180, scale: 0.5 }} 
                  animate={{ rotateY: 0, scale: 1 }} 
                  transition={{ type: 'spring', damping: 15 }}
                  className="text-6xl drop-shadow-2xl"
                >
                  {MOVES[opChoice].emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Divider / Timer / Result */}
        <div className="h-24 w-full flex items-center justify-center relative my-4">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <div className="bg-slate-900 px-6 py-2 z-10 flex flex-col items-center justify-center">
            {roundStatus === 'selecting' && (
              <>
                <span className="text-xs font-bold text-slate-500 uppercase">Make Your Move</span>
                <span className={`text-4xl font-black ${countdown <= 3 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                  00:0{countdown}
                </span>
              </>
            )}
            {roundStatus === 'revealing' && (
              <span className="text-2xl font-black text-yellow-400 tracking-widest animate-pulse">REVEAL!</span>
            )}
            {roundStatus === 'round_over' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                <span className={`text-3xl font-black ${roundWinner === 'me' ? 'text-green-400' : roundWinner === 'opponent' ? 'text-red-400' : 'text-slate-400'}`}>
                  {roundWinner === 'me' ? 'YOU WIN ROUND' : roundWinner === 'opponent' ? 'OPPONENT WINS' : 'DRAW'}
                </span>
                <span className="text-sm text-slate-500 mt-1">Next round starting...</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* My Side */}
        <div className="mt-12 flex flex-col items-center w-full">
          <div className="flex gap-4">
            {(['rock', 'paper', 'scissors'] as Choice[]).map(choice => {
              if (!choice) return null;
              const isSelected = myChoice === choice;
              const isFaded = myChoice && !isSelected;
              
              return (
                <button
                  key={choice}
                  disabled={roundStatus !== 'selecting' || myChoice !== null}
                  onClick={() => handleChoice(choice)}
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center transition-all duration-300
                    ${isSelected 
                      ? 'bg-blue-600 border-2 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.6)] scale-110 z-10' 
                      : 'bg-slate-800 border-2 border-slate-700'
                    }
                    ${isFaded ? 'opacity-30 scale-90' : ''}
                    ${roundStatus === 'selecting' && !myChoice ? 'hover:bg-slate-700 hover:scale-105 cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <span className="text-4xl sm:text-5xl mb-1 sm:mb-2 drop-shadow-xl">{MOVES[choice].emoji}</span>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase ${isSelected ? 'text-white' : 'text-slate-400'}`}>{MOVES[choice].label}</span>
                </button>
              );
            })}
          </div>
          <span className="text-slate-500 font-bold mt-6 uppercase tracking-widest">You</span>
        </div>
      </div>

      {/* Match Over Overlay */}
      <AnimatePresence>
        {roundStatus === 'match_over' && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            className="absolute inset-0 bg-slate-900/80 rounded-3xl flex flex-col items-center justify-center z-50"
          >
            <Trophy className={`w-32 h-32 mb-8 ${matchWinner === 'me' ? 'text-yellow-400' : 'text-red-500'}`} />
            <h2 className="text-6xl font-black mb-4 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-wider">
              {matchWinner === 'me' ? 'MATCH VICTORY!' : 'MATCH DEFEAT'}
            </h2>
            <p className="text-2xl text-slate-300 mb-12 font-medium">
              {matchWinner === 'me' ? 'You outsmarted them.' : `${state.opponentName} claimed the crown.`}
            </p>

            <div className="flex gap-6">
              <button 
                onClick={() => navigate('/games')}
                className="px-10 py-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Return to Lounge
              </button>
              <button 
                onClick={requestRematch}
                disabled={rematchRequested}
                className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center ${
                  rematchRequested 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                }`}
              >
                <RefreshCw className={`w-6 h-6 mr-3 ${rematchRequested ? 'animate-spin' : ''}`} />
                {rematchRequested ? 'Waiting for opponent...' : 'Rematch'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
