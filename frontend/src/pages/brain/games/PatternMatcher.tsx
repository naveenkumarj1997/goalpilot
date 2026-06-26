import React, { useState } from 'react';
import { Target, RotateCcw, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

type PatternType = 'add' | 'multiply' | 'fibonacci' | 'square';

const PatternMatcher = ({ onBack }: { onBack: () => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [sequence, setSequence] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setGameState('PLAYING');
    generatePattern();
  };

  const generatePattern = () => {
    const types: PatternType[] = ['add', 'multiply', 'fibonacci', 'square'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let seq: number[] = [];
    let nextNum = 0;

    if (type === 'add') {
      const step = Math.floor(Math.random() * 10) + 2;
      const start = Math.floor(Math.random() * 20);
      seq = [start, start + step, start + step * 2, start + step * 3];
      nextNum = start + step * 4;
    } 
    else if (type === 'multiply') {
      const step = Math.floor(Math.random() * 3) + 2; // 2 or 3 or 4
      const start = Math.floor(Math.random() * 5) + 1;
      seq = [start, start * step, start * step * step, start * step * step * step];
      nextNum = start * step * step * step * step;
    }
    else if (type === 'fibonacci') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + a;
      seq = [a, b, a + b, a + 2 * b]; // a, b, a+b, a+2b, 2a+3b
      nextNum = 2 * a + 3 * b;
    }
    else if (type === 'square') {
      const start = Math.floor(Math.random() * 5) + 2;
      seq = [start * start, (start + 1) * (start + 1), (start + 2) * (start + 2), (start + 3) * (start + 3)];
      nextNum = (start + 4) * (start + 4);
    }

    setSequence(seq);
    setCorrectAnswer(nextNum);

    // Generate 3 wrong options close to the real answer
    const opts = [nextNum];
    while (opts.length < 4) {
      const offset = (Math.floor(Math.random() * 11) - 5) * (Math.floor(Math.random() * 5) + 1);
      const wrong = nextNum + offset;
      if (!opts.includes(wrong) && wrong > 0) {
        opts.push(wrong);
      }
    }
    
    // Shuffle options
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  const handleGuess = (guess: number) => {
    if (gameState !== 'PLAYING') return;

    if (guess === correctAnswer) {
      setScore(s => s + ((100 + (streak * 10)) * difficulty));
      setStreak(s => s + 1);
      generatePattern();
    } else {
      setGameState('GAMEOVER');
    }
  };

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] text-center">
      <div className="flex justify-between items-center mb-8 text-slate-300">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-emerald-400 mr-2" />
          <span className="font-bold text-emerald-400">Score: {score}</span>
        </div>
        <div className="text-sm font-bold text-slate-400">Streak: {streak} 🔥</div>
      </div>

      <div className="min-h-[350px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-3xl font-bold text-white mb-4">Pattern Matcher</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Deduce the mathematical rule of the sequence and identify the next number.
            </p>
            
            <div className="flex gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1x)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (2x)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (3x)</button>
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
            <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
              {sequence.map((num, idx) => (
                <div key={idx} className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-slate-800 rounded-2xl border border-slate-700 text-2xl md:text-3xl font-black text-white">
                  {num}
                </div>
              ))}
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-emerald-500/20 rounded-2xl border-2 border-dashed border-emerald-500 text-3xl font-black text-emerald-400">
                ?
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(opt)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 text-white font-bold rounded-xl text-xl transition-all"
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
