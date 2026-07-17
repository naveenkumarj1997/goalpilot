import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw, XCircle, Activity, Timer } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

type MatrixRule = 'rowSum' | 'colSum' | 'rowAdd' | 'colMult' | 'rowSub' | 'colSub' | 'diagSum';

const NumberMatrix = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [matrix, setMatrix] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(100);

  const timerRef = useRef<any>(null);
  const historyRef = useRef<MatrixRule[]>([]);

  const getGameParams = () => {
    switch(difficulty) {
      case 1: return { timeMs: 30000, rules: ['rowSum', 'colSum'] as MatrixRule[], maxNum: 15 };
      case 2: return { timeMs: 25000, rules: ['rowSum', 'colSum', 'rowAdd', 'colMult'] as MatrixRule[], maxNum: 25 };
      case 3: return { timeMs: 20000, rules: ['rowAdd', 'colMult', 'rowSub', 'colSub', 'diagSum'] as MatrixRule[], maxNum: 40 };
      default: return { timeMs: 30000, rules: ['rowSum'] as MatrixRule[], maxNum: 15 };
    }
  };

  const startGame = () => {
    setScore(0);
    historyRef.current = [];
    setGameState('PLAYING');
    generateMatrix();
  };

  const generateMatrix = () => {
    const params = getGameParams();
    let rule: MatrixRule;
    let attempts = 0;
    
    do {
      rule = params.rules[Math.floor(Math.random() * params.rules.length)];
      attempts++;
    } while (historyRef.current.includes(rule) && attempts < 10);
    
    historyRef.current.push(rule);
    if (historyRef.current.length > 2) historyRef.current.shift(); // keep last 2 rules

    let grid = new Array(9).fill(0);
    let ans = 0;

    if (rule === 'rowSum') {
      const sum = Math.floor(Math.random() * (params.maxNum - 10)) + 15;
      for (let r = 0; r < 3; r++) {
        const a = Math.floor(Math.random() * (sum - 2)) + 1;
        const b = Math.floor(Math.random() * (sum - a - 1)) + 1;
        const c = sum - a - b;
        grid[r*3] = a; grid[r*3+1] = b; grid[r*3+2] = c;
      }
      ans = grid[8];
    } 
    else if (rule === 'colSum') {
      const sum = Math.floor(Math.random() * (params.maxNum - 10)) + 15;
      for (let c = 0; c < 3; c++) {
        const a = Math.floor(Math.random() * (sum - 2)) + 1;
        const b = Math.floor(Math.random() * (sum - a - 1)) + 1;
        const c_val = sum - a - b;
        grid[c] = a; grid[3+c] = b; grid[6+c] = c_val;
      }
      ans = grid[8];
    }
    else if (rule === 'rowAdd') {
      for (let c = 0; c < 3; c++) {
        grid[c] = Math.floor(Math.random() * (params.maxNum / 2)) + 1;
        grid[3+c] = Math.floor(Math.random() * (params.maxNum / 2)) + 1;
        grid[6+c] = grid[c] + grid[3+c];
      }
      ans = grid[8];
    }
    else if (rule === 'colMult') {
      for (let r = 0; r < 3; r++) {
        grid[r*3] = Math.floor(Math.random() * 5) + 2;
        grid[r*3+1] = Math.floor(Math.random() * 5) + 2;
        grid[r*3+2] = grid[r*3] * grid[r*3+1];
      }
      ans = grid[8];
    }
    else if (rule === 'rowSub') {
      for (let c = 0; c < 3; c++) {
        const a = Math.floor(Math.random() * params.maxNum) + 15;
        const b = Math.floor(Math.random() * (a - 2)) + 1;
        grid[c] = a;
        grid[3+c] = b;
        grid[6+c] = a - b;
      }
      ans = grid[8];
    }
    else if (rule === 'colSub') {
      for (let r = 0; r < 3; r++) {
        const a = Math.floor(Math.random() * params.maxNum) + 15;
        const b = Math.floor(Math.random() * (a - 2)) + 1;
        grid[r*3] = a;
        grid[r*3+1] = b;
        grid[r*3+2] = a - b;
      }
      ans = grid[8];
    }
    else if (rule === 'diagSum') {
      // Magic square like logic where diagonals matter
      const sum = Math.floor(Math.random() * params.maxNum) + 20;
      for (let i = 0; i < 9; i++) grid[i] = Math.floor(Math.random() * 15) + 1;
      grid[0] = Math.floor(Math.random() * (sum - 2)) + 1;
      grid[4] = Math.floor(Math.random() * (sum - grid[0] - 1)) + 1;
      grid[8] = sum - grid[0] - grid[4];
      ans = grid[8];
    }

    setMatrix(grid);
    setCorrectAnswer(ans);

    // Generate 3 wrong options
    const opts = [ans];
    while (opts.length < 4) {
      const maxOffset = Math.max(5, Math.floor(ans * 0.3));
      const offset = (Math.floor(Math.random() * maxOffset) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = ans + offset;
      if (!opts.includes(wrong) && wrong > 0) {
        opts.push(wrong);
      }
    }
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
  }, [gameState, score, difficulty]);

  const handleGuess = (guess: number) => {
    if (gameState !== 'PLAYING') return;

    if (guess === correctAnswer) {
      setScore(s => s + (150 * difficulty));
      generateMatrix();
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
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Search className="w-5 h-5 text-blue-400 mr-2" />
          <span className="font-bold text-blue-400">Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Number Matrix</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Deduce the mathematical relationship in the 3x3 grid to find the missing number before time runs out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
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
                  className={`h-full transition-all duration-75 linear ${timeLeft > 50 ? 'bg-blue-500' : timeLeft > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.max(0, timeLeft)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-xs mx-auto mb-12">
              {matrix.map((num, idx) => (
                <div key={idx} className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl text-3xl md:text-4xl font-black shadow-[0_0_15px_rgba(0,0,0,0.5)] ${idx === 8 ? 'bg-blue-500/20 border-2 border-dashed border-blue-500 text-blue-400 animate-pulse' : 'bg-slate-800 border border-slate-700 text-white'}`}>
                  {idx === 8 ? '?' : num}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(opt)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 text-white font-bold rounded-xl text-xl transition-all shadow-md"
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
              <XCircle className="w-8 h-8 mr-2" /> Incorrect Deduction!
            </div>
            <p className="text-slate-400 mb-2">The missing number was: <span className="text-blue-400 font-bold">{correctAnswer}</span></p>
            <p className="text-slate-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('matrix', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('matrix', score).color}`}>
                  {getIQRank('matrix', score).percentile} ({getIQRank('matrix', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('matrix', score).message}</p>
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

export default NumberMatrix;
