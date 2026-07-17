import React, { useState, useEffect, useRef } from 'react';
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
  const [difficulty, setDifficulty] = useState(1);

  const historyRef = useRef<string[]>([]);

  const getGameParams = () => {
    switch (difficulty) {
      case 1: return { length: 3, maxAttempts: 10 };
      case 2: return { length: 4, maxAttempts: 8 };
      case 3: return { length: 5, maxAttempts: 6 };
      default: return { length: 3, maxAttempts: 10 };
    }
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    historyRef.current = [];
    generateCode();
  };

  const generateCode = () => {
    const params = getGameParams();
    let code = '';
    let attempts = 0;

    do {
      code = Array.from({ length: params.length }, () => Math.floor(Math.random() * 10)).join('');
      attempts++;
    } while (historyRef.current.includes(code) && attempts < 20);

    historyRef.current.push(code);
    if (historyRef.current.length > 5) historyRef.current.shift();

    setSecretCode(code);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('PLAYING');
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const params = getGameParams();
    if (currentGuess.length !== params.length) return;

    let exact = 0;
    let numberMatch = 0;
    
    // Calculate Bulls and Cows
    const secretArr = secretCode.split('');
    const guessArr = currentGuess.split('');
    const secretUsed = new Array(params.length).fill(false);
    const guessUsed = new Array(params.length).fill(false);

    // First pass: exact matches
    for (let i = 0; i < params.length; i++) {
      if (guessArr[i] === secretArr[i]) {
        exact++;
        secretUsed[i] = true;
        guessUsed[i] = true;
      }
    }

    // Second pass: number matches (wrong position)
    for (let i = 0; i < params.length; i++) {
      if (!guessUsed[i]) {
        for (let j = 0; j < params.length; j++) {
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

    if (exact === params.length) {
      // Won!
      const guessesTaken = newGuesses.length;
      let points = (500 * difficulty) - (guessesTaken * 50 * difficulty);
      if (points < 50) points = 50; // Minimum points for getting it
      
      setScore(s => s + (points * level));
      setLevel(l => l + 1);
      setTimeout(() => generateCode(), 1500);
    } else if (newGuesses.length >= params.maxAttempts) {
      // Lost after max guesses
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
              Crack the safe code.<br/>
              <span className="text-green-400 font-bold">Green:</span> Right number, right spot.<br/>
              <span className="text-yellow-400 font-bold">Yellow:</span> Right number, wrong spot.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (3-Digit)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (4-Digit)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (5-Digit)</button>
            </div>

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
                maxLength={getGameParams().length}
                value={currentGuess}
                onChange={e => setCurrentGuess(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={"0".repeat(getGameParams().length)}
                className="w-32 sm:w-48 text-center text-3xl sm:text-4xl tracking-widest bg-slate-900/80 border-2 border-blue-500/50 rounded-2xl p-4 text-white focus:border-blue-400 focus:outline-none font-mono"
                autoFocus
              />
              <button 
                type="submit"
                disabled={currentGuess.length !== getGameParams().length}
                className="px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition-colors"
              >
                Guess
              </button>
            </form>

            <div className="w-full max-w-md space-y-2">
              <p className="text-slate-400 text-sm mb-4">Attempts Remaining: {getGameParams().maxAttempts - guesses.length}</p>
              {guesses.map((g, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                  <span className="text-xl sm:text-2xl font-mono text-white tracking-widest">{g.guess}</span>
                  <div className="flex gap-1 sm:gap-2">
                    {Array.from({ length: g.exactMatches }).map((_, j) => (
                      <CheckCircle2 key={`e-${j}`} className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    ))}
                    {Array.from({ length: g.numberMatches }).map((_, j) => (
                      <CheckCircle2 key={`n-${j}`} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    ))}
                    {Array.from({ length: getGameParams().length - g.exactMatches - g.numberMatches }).map((_, j) => (
                      <XCircle key={`x-${j}`} className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                    ))}
                  </div>
                </div>
              ))}
              {guesses.length > 0 && guesses[0].exactMatches === getGameParams().length && (
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
