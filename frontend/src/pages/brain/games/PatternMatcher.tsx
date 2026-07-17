import React, { useState, useEffect, useRef } from 'react';
import { Target, RotateCcw, XCircle, Activity, Timer } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

type PatternType = 'add' | 'multiply' | 'fibonacci' | 'square' | 'cube' | 'alternating' | 'subtract';

const PatternMatcher = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [sequence, setSequence] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(100);

  const timerRef = useRef<any>(null);
  const historyRef = useRef<string[]>([]);

  const getGameParams = () => {
    switch(difficulty) {
      case 1: return { timeMs: 15000, types: ['add', 'subtract', 'square'] as PatternType[], maxStart: 10 };
      case 2: return { timeMs: 10000, types: ['add', 'multiply', 'square', 'fibonacci'] as PatternType[], maxStart: 20 };
      case 3: return { timeMs: 7000, types: ['multiply', 'fibonacci', 'cube', 'alternating'] as PatternType[], maxStart: 15 };
      default: return { timeMs: 10000, types: ['add'] as PatternType[], maxStart: 10 };
    }
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    historyRef.current = [];
    setGameState('PLAYING');
    generatePattern();
  };

  const generatePattern = () => {
    const params = getGameParams();
    let type: PatternType;
    let seqKey = '';
    let seq: number[] = [];
    let nextNum = 0;
    let attempts = 0;

    do {
      type = params.types[Math.floor(Math.random() * params.types.length)];
      
      if (type === 'add') {
        const step = Math.floor(Math.random() * 10) + 2;
        const start = Math.floor(Math.random() * params.maxStart);
        seq = [start, start + step, start + step * 2, start + step * 3];
        nextNum = start + step * 4;
        seqKey = `add-${step}`;
      }
      else if (type === 'subtract') {
        const step = Math.floor(Math.random() * 8) + 2;
        const start = Math.floor(Math.random() * 20) + 40; // High start
        seq = [start, start - step, start - step * 2, start - step * 3];
        nextNum = start - step * 4;
        seqKey = `sub-${step}`;
      }
      else if (type === 'multiply') {
        const step = Math.floor(Math.random() * 3) + 2; // 2 or 3 or 4
        const start = Math.floor(Math.random() * 5) + 1;
        seq = [start, start * step, start * step * step, start * step * step * step];
        nextNum = start * step * step * step * step;
        seqKey = `mul-${step}`;
      }
      else if (type === 'fibonacci') {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + a;
        seq = [a, b, a + b, a + 2 * b]; 
        nextNum = 2 * a + 3 * b;
        seqKey = `fib-${a}-${b}`;
      }
      else if (type === 'square') {
        const start = Math.floor(Math.random() * (params.maxStart / 2)) + 2;
        seq = [start * start, (start + 1) * (start + 1), (start + 2) * (start + 2), (start + 3) * (start + 3)];
        nextNum = (start + 4) * (start + 4);
        seqKey = `sq-${start}`;
      }
      else if (type === 'cube') {
        const start = Math.floor(Math.random() * 4) + 1;
        seq = [start ** 3, (start + 1) ** 3, (start + 2) ** 3, (start + 3) ** 3];
        nextNum = (start + 4) ** 3;
        seqKey = `cu-${start}`;
      }
      else if (type === 'alternating') {
        const start = Math.floor(Math.random() * 10) + 5;
        const step1 = Math.floor(Math.random() * 5) + 2;
        const step2 = Math.floor(Math.random() * 3) + 1;
        // +step1, -step2
        seq = [start, start + step1, start + step1 - step2, start + step1 * 2 - step2];
        nextNum = start + step1 * 2 - step2 * 2;
        seqKey = `alt-${step1}-${step2}`;
      }
      attempts++;
    } while (historyRef.current.includes(seqKey) && attempts < 15);

    historyRef.current.push(seqKey);
    if (historyRef.current.length > 3) historyRef.current.shift();

    setSequence(seq);
    setCorrectAnswer(nextNum);

    // Generate 3 wrong options close to the real answer
    const opts = [nextNum];
    while (opts.length < 4) {
      // +/- up to 10 depending on answer size
      const maxOffset = Math.max(5, Math.floor(nextNum * 0.2)); 
      const offset = (Math.floor(Math.random() * maxOffset) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = nextNum + offset;
      if (!opts.includes(wrong)) {
        opts.push(wrong);
      }
    }
    
    // Shuffle options
    setOptions(opts.sort(() => Math.random() - 0.5));
    setTimeLeft(100);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const { timeMs } = getGameParams();
      const tickRate = 50; 
      const decreaseAmount = 100 / (timeMs / tickRate);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= decreaseAmount) {
            clearInterval(timerRef.current);
            setGameState('GAMEOVER');
            return 0;
          }
          return t - decreaseAmount;
        });
      }, tickRate);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, streak, difficulty]);

  const handleGuess = (guess: number) => {
    if (gameState !== 'PLAYING') return;

    if (guess === correctAnswer) {
      setScore(s => s + ((100 + (streak * 10)) * difficulty));
      setStreak(s => s + 1);
      generatePattern();
    } else {
      clearInterval(timerRef.current);
      setGameState('GAMEOVER');
    }
  };

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-emerald-400 mr-2" />
          <span className="font-bold text-emerald-400">Score: {score}</span>
        </div>
        <div className="text-sm font-bold text-slate-400">Streak: {streak} 🔥</div>
      </div>

      <div className="min-h-[350px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Pattern Matcher</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Deduce the mathematical rule of the sequence and identify the next number before time runs out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full">
            <div className="flex items-center justify-center mb-8">
              <Timer className="w-5 h-5 text-slate-400 mr-2" />
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 linear ${timeLeft > 50 ? 'bg-emerald-500' : timeLeft > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.max(0, timeLeft)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
              {sequence.map((num, idx) => (
                <div key={idx} className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-slate-800 rounded-2xl border border-slate-700 text-2xl md:text-3xl font-black text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {num}
                </div>
              ))}
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-emerald-500/20 rounded-2xl border-2 border-dashed border-emerald-500 text-3xl font-black text-emerald-400 animate-pulse">
                ?
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(opt)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 text-white font-bold rounded-xl text-xl transition-all shadow-md"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade">
            <div className="text-red-400 text-2xl font-bold mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 mr-2" /> Pattern Broken!
            </div>
            <p className="text-slate-400 mb-2">The correct next number was: <span className="text-emerald-400 font-bold">{correctAnswer}</span></p>
            <p className="text-slate-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('pattern', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('pattern', score).color}`}>
                  {getIQRank('pattern', score).percentile} ({getIQRank('pattern', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('pattern', score).message}</p>
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

export default PatternMatcher;
