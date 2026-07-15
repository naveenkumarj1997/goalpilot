import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, XCircle, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const NumberMatrix = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [matrix, setMatrix] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    generateMatrix();
  };

  const generateMatrix = () => {
    const rules = ['rowSum', 'colSum', 'rowAdd', 'colMult'];
    const rule = rules[Math.floor(Math.random() * rules.length)];
    
    let grid = new Array(9).fill(0);
    let ans = 0;

    if (rule === 'rowSum') {
      const sum = Math.floor(Math.random() * 20) + 15;
      for (let r = 0; r < 3; r++) {
        const a = Math.floor(Math.random() * (sum - 2)) + 1;
        const b = Math.floor(Math.random() * (sum - a - 1)) + 1;
        const c = sum - a - b;
        grid[r*3] = a; grid[r*3+1] = b; grid[r*3+2] = c;
      }
      ans = grid[8];
    } 
    else if (rule === 'colSum') {
      const sum = Math.floor(Math.random() * 20) + 15;
      for (let c = 0; c < 3; c++) {
        const a = Math.floor(Math.random() * (sum - 2)) + 1;
        const b = Math.floor(Math.random() * (sum - a - 1)) + 1;
        const c_val = sum - a - b;
        grid[c] = a; grid[3+c] = b; grid[6+c] = c_val;
      }
      ans = grid[8];
    }
    else if (rule === 'rowAdd') {
      // Row3 = Row1 + Row2
      for (let c = 0; c < 3; c++) {
        grid[c] = Math.floor(Math.random() * 10) + 1;
        grid[3+c] = Math.floor(Math.random() * 10) + 1;
        grid[6+c] = grid[c] + grid[3+c];
      }
      ans = grid[8];
    }
    else if (rule === 'colMult') {
      // Col3 = Col1 * Col2
      for (let r = 0; r < 3; r++) {
        grid[r*3] = Math.floor(Math.random() * 5) + 2;
        grid[r*3+1] = Math.floor(Math.random() * 5) + 2;
        grid[r*3+2] = grid[r*3] * grid[r*3+1];
      }
      ans = grid[8];
    }

    setMatrix(grid);
    setCorrectAnswer(ans);

    // Generate 3 wrong options
    const opts = [ans];
    while (opts.length < 4) {
      const offset = (Math.floor(Math.random() * 11) - 5) * (Math.floor(Math.random() * 3) + 1);
      const wrong = ans + offset;
      if (!opts.includes(wrong) && wrong > 0) {
        opts.push(wrong);
      }
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  const handleGuess = (guess: number) => {
    if (gameState !== 'PLAYING') return;

    if (guess === correctAnswer) {
      setScore(s => s + (150 * difficulty));
      generateMatrix();
    } else {
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
              Deduce the mathematical relationship in the 3x3 grid to find the missing number.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1x)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (2x)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (3x)</button>
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
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-xs mx-auto mb-12">
              {matrix.map((num, idx) => (
                <div key={idx} className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl text-3xl md:text-4xl font-black ${idx === 8 ? 'bg-blue-500/20 border-2 border-dashed border-blue-500 text-blue-400' : 'bg-slate-800 border border-slate-700 text-white'}`}>
                  {idx === 8 ? '?' : num}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(opt)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 text-white font-bold rounded-xl text-xl transition-all"
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
