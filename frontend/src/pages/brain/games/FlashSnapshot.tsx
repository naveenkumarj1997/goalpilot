import React, { useState, useEffect, useRef } from 'react';
import { Camera, RotateCcw, Activity, XCircle } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500'];
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Cyan', 'Orange'];

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

  const historyRef = useRef<string[]>([]);

  const getGameParams = () => {
    switch (difficulty) {
      case 1: return { gridSize: 2, totalCells: 4, flashTime: 1500, numColors: 3 };
      case 2: return { gridSize: 3, totalCells: 9, flashTime: 800, numColors: 5 };
      case 3: return { gridSize: 4, totalCells: 16, flashTime: 400, numColors: 8 };
      default: return { gridSize: 3, totalCells: 9, flashTime: 800, numColors: 5 };
    }
  };

  const startGame = () => {
    setScore(0);
    historyRef.current = [];
    generateSnapshot();
  };

  const generateSnapshot = () => {
    const params = getGameParams();
    const newGrid: Shape[] = [];
    for (let i = 0; i < params.totalCells; i++) {
      const colIdx = Math.floor(Math.random() * params.numColors);
      newGrid.push({ color: COLORS[colIdx], name: COLOR_NAMES[colIdx], pos: i });
    }
    setGrid(newGrid);
    setGameState('FLASH');

    setTimeout(() => {
      generateQuestion(newGrid, params);
      setGameState('QUESTION');
    }, params.flashTime);
  };

  const generateQuestion = (currentGrid: Shape[], params: { gridSize: number, totalCells: number, numColors: number }) => {
    // Determine possible question types based on grid
    const type = Math.random() > 0.5 ? 'position' : 'count';
    
    let qText = '';
    let ans = '';
    let opts: string[] = [];
    
    let attempts = 0;
    do {
      if (type === 'position') {
        const pos = Math.floor(Math.random() * params.totalCells);
        // Map 1D pos to 2D
        const row = Math.floor(pos / params.gridSize) + 1;
        const col = (pos % params.gridSize) + 1;
        qText = `What color was in Row ${row}, Column ${col}?`;
        ans = currentGrid[pos].name;
        opts = [...COLOR_NAMES].slice(0, params.numColors).sort(() => Math.random() - 0.5).slice(0, 4);
        if (!opts.includes(ans)) {
          opts[0] = ans;
          opts.sort(() => Math.random() - 0.5);
        }
      } else {
        const colorType = COLOR_NAMES[Math.floor(Math.random() * params.numColors)];
        qText = `How many ${colorType} blocks were there?`;
        ans = currentGrid.filter(s => s.name === colorType).length.toString();
        opts = [ans];
        while (opts.length < 4) {
          const randNum = Math.floor(Math.random() * (params.totalCells / 2 + 2)).toString();
          if (!opts.includes(randNum)) opts.push(randNum);
        }
        opts.sort(() => Math.random() - 0.5);
      }
      attempts++;
    } while (historyRef.current.includes(qText) && attempts < 10);

    historyRef.current.push(qText);
    if (historyRef.current.length > 5) historyRef.current.shift();

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
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (2x2)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (3x3)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (4x4)</button>
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
          <div 
            className="grid gap-2 md:gap-4 mx-auto" 
            style={{ gridTemplateColumns: `repeat(${getGameParams().gridSize}, minmax(0, 1fr))` }}
          >
            {grid.map((shape, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl ${shape.color} shadow-lg shadow-black/20`} 
                style={{ 
                  width: getGameParams().gridSize === 4 ? '3.5rem' : getGameParams().gridSize === 3 ? '4.5rem' : '6rem',
                  height: getGameParams().gridSize === 4 ? '3.5rem' : getGameParams().gridSize === 3 ? '4.5rem' : '6rem'
                }}
              />
            ))}
          </div>
        )}

        {gameState === 'QUESTION' && (
          <div className="animate-slide-up-fade w-full">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-md mx-auto">
              <h3 className="text-xl md:text-2xl sm:text-3xl font-bold text-white leading-relaxed">{question}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); handleGuess(opt); }}
                  onPointerDown={(e) => { e.preventDefault(); handleGuess(opt); }}
                  className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-fuchsia-500/50 text-white font-bold rounded-xl text-xl transition-all active:scale-95 touch-manipulation"
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
