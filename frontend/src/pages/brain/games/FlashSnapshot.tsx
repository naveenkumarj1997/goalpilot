import React, { useState, useEffect } from 'react';
import { Camera, RotateCcw, Activity, XCircle } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-purple-500'];
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];

type Shape = {
  color: string;
  name: string;
  pos: number;
};

const FlashSnapshot = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'FLASH' | 'QUESTION' | 'GAMEOVER'>('START');
  const [grid, setGrid] = useState<Shape[]>([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setScore(0);
    generateSnapshot();
  };

  const generateSnapshot = () => {
    // Generate 3x3 grid
    const newGrid: Shape[] = [];
    for (let i = 0; i < 9; i++) {
      const colIdx = Math.floor(Math.random() * COLORS.length);
      newGrid.push({ color: COLORS[colIdx], name: COLOR_NAMES[colIdx], pos: i });
    }
    setGrid(newGrid);
    setGameState('FLASH');

    // Display duration depends on difficulty (Hard = 0.3s, Med = 0.6s, Easy = 1s)
    const flashTime = difficulty === 1 ? 1000 : difficulty === 2 ? 600 : 300;

    setTimeout(() => {
      generateQuestion(newGrid);
      setGameState('QUESTION');
    }, flashTime);
  };

  const generateQuestion = (currentGrid: Shape[]) => {
    // Two types of questions: 
    // 1. What color was at position X?
    // 2. How many items were color Y?
    const type = Math.random() > 0.5 ? 'position' : 'count';

    let qText = '';
    let ans = '';
    let opts: string[] = [];

    if (type === 'position') {
      const pos = Math.floor(Math.random() * 9);
      const positions = ['top-left', 'top-center', 'top-right', 'middle-left', 'center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'];
      qText = `What color was in the ${positions[pos]}?`;
      ans = currentGrid[pos].name;
      opts = [...COLOR_NAMES].sort(() => Math.random() - 0.5).slice(0, 4);
      if (!opts.includes(ans)) {
        opts[0] = ans;
        opts.sort(() => Math.random() - 0.5);
      }
    } else {
      const colorType = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
      qText = `How many ${colorType} blocks were there?`;
      ans = currentGrid.filter(s => s.name === colorType).length.toString();
      opts = [ans];
      while (opts.length < 4) {
        const randNum = Math.floor(Math.random() * 6).toString();
        if (!opts.includes(randNum)) opts.push(randNum);
      }
      opts.sort(() => Math.random() - 0.5);
    }

    setQuestion(qText);
    setCorrectAnswer(ans);
    setOptions(opts);
  };

  const handleGuess = (guess: string) => {
    if (gameState !== 'QUESTION') return;

    if (guess === correctAnswer) {
      setScore(s => s + (150 * difficulty));
      generateSnapshot();
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
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-fuchsia-500/30 shadow-[0_0_40px_rgba(217,70,239,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Camera className="w-5 h-5 text-fuchsia-400 mr-2" />
          <span className="font-bold text-fuchsia-400">Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Flash Snapshot</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              A grid flashes for milliseconds. You must recall specific details with absolute eidetic clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (1s)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (0.6s)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (0.3s)</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'FLASH' && (
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-xs mx-auto">
            {grid.map((shape, idx) => (
              <div key={idx} className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${shape.color} shadow-lg shadow-black/20`} />
            ))}
          </div>
        )}

        {gameState === 'QUESTION' && (
          <div className="animate-slide-up-fade w-full">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-md mx-auto">
              <h3 className="text-2xl md:text-2xl sm:text-3xl font-bold text-white leading-relaxed">{question}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(opt)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-fuchsia-500/50 text-white font-bold rounded-xl text-xl transition-all"
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
              <XCircle className="w-8 h-8 mr-2" /> Memory Blur!
            </div>
            <p className="text-slate-400 mb-2">The correct answer was: <span className="text-fuchsia-400 font-bold">{correctAnswer}</span></p>
            <p className="text-slate-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('flash', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('flash', score).color}`}>
                  {getIQRank('flash', score).percentile} ({getIQRank('flash', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('flash', score).message}</p>
            </div>

            <button 
              onClick={() => setGameState('START')}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSnapshot;
