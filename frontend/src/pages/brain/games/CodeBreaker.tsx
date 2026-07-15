import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Brain, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

type GuessFeedback = {
  guess: string;
  exactMatches: number; // Bulls
  numberMatches: number; // Cows
};

const CodeBreaker = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [secretCode, setSecretCode] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessFeedback[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [level, setLevel] = useState(1);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    generateCode();
  };

  const generateCode = () => {
    // 3 digits
    const code = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
    setSecretCode(code);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('PLAYING');
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.length !== 3) return;

    let exact = 0;
    let numberMatch = 0;
    
    // Calculate Bulls and Cows
    const secretArr = secretCode.split('');
    const guessArr = currentGuess.split('');
    const secretUsed = [false, false, false];
    const guessUsed = [false, false, false];

    // First pass: exact matches
    for (let i = 0; i < 3; i++) {
      if (guessArr[i] === secretArr[i]) {
        exact++;
        secretUsed[i] = true;
        guessUsed[i] = true;
      }
    }

    // Second pass: number matches (wrong position)
    for (let i = 0; i < 3; i++) {
      if (!guessUsed[i]) {
        for (let j = 0; j < 3; j++) {
          if (!secretUsed[j] && guessArr[i] === secretArr[j]) {
            numberMatch++;
            secretUsed[j] = true;
            break;
          }
        }
      }
    }

    const newFeedback = { guess: currentGuess, exactMatches: exact, numberMatches: numberMatch };
    const newGuesses = [newFeedback, ...guesses];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (exact === 3) {
      // Won!
      const guessesTaken = newGuesses.length;
      let points = 500 - (guessesTaken * 50);
      if (points < 50) points = 50; // Minimum points for getting it
      
      setScore(s => s + (points * level));
      setLevel(l => l + 1);
      setTimeout(() => generateCode(), 1500);
    } else if (newGuesses.length >= 8) {
      // Lost after 8 guesses
      setGameState('GAMEOVER');
    }
  };

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-blue-400 mr-2" />
          <span className="font-bold">Level {level}</span>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Code Breaker</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Crack the 3-digit safe code. You have 8 attempts.<br/>
              <span className="text-green-400 font-bold">Green:</span> Right number, right spot.<br/>
              <span className="text-yellow-400 font-bold">Yellow:</span> Right number, wrong spot.
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Hacking
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full flex flex-col items-center">
            
            <form onSubmit={handleGuess} className="mb-8 flex gap-4">
              <input 
                type="text"
                maxLength={3}
                value={currentGuess}
                onChange={e => setCurrentGuess(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000"
                className="w-32 text-center text-4xl tracking-widest bg-slate-900/80 border-2 border-blue-500/50 rounded-2xl p-4 text-white focus:border-blue-400 focus:outline-none font-mono"
                autoFocus
              />
              <button 
                type="submit"
                disabled={currentGuess.length !== 3}
                className="px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition-colors"
              >
                Guess
              </button>
            </form>

            <div className="w-full max-w-md space-y-2">
              <p className="text-slate-400 text-sm mb-4">Attempts Remaining: {8 - guesses.length}</p>
              {guesses.map((g, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <span className="text-2xl font-mono text-white tracking-widest">{g.guess}</span>
                  <div className="flex gap-2">
                    {Array.from({ length: g.exactMatches }).map((_, j) => (
                      <CheckCircle2 key={`e-${j}`} className="w-6 h-6 text-green-500" />
                    ))}
                    {Array.from({ length: g.numberMatches }).map((_, j) => (
                      <CheckCircle2 key={`n-${j}`} className="w-6 h-6 text-yellow-500" />
                    ))}
                    {Array.from({ length: 3 - g.exactMatches - g.numberMatches }).map((_, j) => (
                      <XCircle key={`x-${j}`} className="w-6 h-6 text-slate-600" />
                    ))}
                  </div>
                </div>
              ))}
              {guesses.length > 0 && guesses[0].exactMatches === 3 && (
                <div className="text-green-400 font-bold mt-4 animate-pulse text-xl">Access Granted!</div>
              )}
            </div>

          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-red-400 text-2xl font-bold mb-4">Access Denied!</div>
            <p className="text-slate-400 mb-8">The secret code was: <span className="text-white font-mono text-2xl tracking-widest">{secretCode}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('code', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('code', score).color}`}>
                  {getIQRank('code', score).percentile} ({getIQRank('code', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('code', score).message}</p>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeBreaker;
