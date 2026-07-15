import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Brain, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const SHAPES = ['●', '■', '▲', '★'];
const COLORS = [
  { name: 'Red', class: 'text-red-500' },
  { name: 'Blue', class: 'text-blue-500' },
  { name: 'Green', class: 'text-green-500' },
  { name: 'Yellow', class: 'text-yellow-500' },
  { name: 'Purple', class: 'text-purple-500' }
];
const SHAPE_NAMES = ['Circles', 'Squares', 'Triangles', 'Stars'];

type RenderedShape = {
  id: number;
  shapeIdx: number;
  colorIdx: number;
  top: number;
  left: number;
};

const ShapeCount = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'FLASHING' | 'ASKING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [shapes, setShapes] = useState<RenderedShape[]>([]);
  const [question, setQuestion] = useState<{ colorIdx: number, shapeIdx: number, answer: number } | null>(null);
  const [userInput, setUserInput] = useState('');

  const startGame = () => {
    setLevel(1);
    setScore(0);
    generateRound(1);
  };

  const generateRound = (lvl: number) => {
    const numShapes = Math.min(5 + lvl * 3, 30); // 8 up to 30 shapes
    const newShapes: RenderedShape[] = [];
    
    const countMap = new Map<string, number>();

    for (let i = 0; i < numShapes; i++) {
      const sIdx = Math.floor(Math.random() * SHAPES.length);
      const cIdx = Math.floor(Math.random() * COLORS.length);
      
      const key = `${cIdx}-${sIdx}`;
      countMap.set(key, (countMap.get(key) || 0) + 1);

      newShapes.push({
        id: i,
        shapeIdx: sIdx,
        colorIdx: cIdx,
        top: 10 + Math.random() * 80, // 10% to 90%
        left: 10 + Math.random() * 80,
      });
    }

    setShapes(newShapes);
    
    // Pick a random shape/color combo that exists (or maybe doesn't!)
    // Let's pick one that actually exists to make it fair, but sometimes 0.
    const keys = Array.from(countMap.keys());
    if (keys.length > 0) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const [c, s] = randomKey.split('-').map(Number);
      setQuestion({
        colorIdx: c,
        shapeIdx: s,
        answer: countMap.get(randomKey) || 0
      });
    } else {
      // Fallback
      setQuestion({ colorIdx: 0, shapeIdx: 0, answer: 0 });
    }

    setUserInput('');
    setGameState('FLASHING');

    setTimeout(() => {
      setGameState('ASKING');
    }, 1500); // Flash for 1.5s
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    const guess = parseInt(userInput);
    if (guess === question.answer) {
      setScore(s => s + (level * 100));
      setLevel(l => l + 1);
      generateRound(level + 1);
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
    <div className="glass max-w-4xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-cyan-400 mr-2" />
          <span className="font-bold">Level {level}</span>
        </div>
      </div>

      <div className="min-h-[500px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Shape Count</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              A jumble of colored shapes will flash for a split second. Memorize them quickly and answer the question.
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Flashing
            </button>
          </div>
        )}

        {gameState === 'FLASHING' && (
          <div className="w-full h-[400px] relative bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
            {shapes.map(s => (
              <div 
                key={s.id} 
                className={`absolute text-4xl ${COLORS[s.colorIdx].class} drop-shadow-md`}
                style={{ top: `${s.top}%`, left: `${s.left}%`, transform: 'translate(-50%, -50%)' }}
              >
                {SHAPES[s.shapeIdx]}
              </div>
            ))}
          </div>
        )}

        {gameState === 'ASKING' && question && (
          <div className="animate-slide-up-fade w-full max-w-md">
            <h3 className="text-2xl text-white mb-8">
              How many <span className={`font-bold ${COLORS[question.colorIdx].class}`}>{COLORS[question.colorIdx].name}</span> {SHAPE_NAMES[question.shapeIdx]} were there?
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="number"
                min="0"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Enter number..."
                className="w-full text-center text-3xl bg-slate-900/80 border-2 border-cyan-500/50 rounded-2xl p-4 text-white focus:border-cyan-400 focus:outline-none"
                autoFocus
              />
              <button 
                type="submit"
                disabled={userInput === ''}
                className="px-6 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition-colors text-lg"
              >
                Submit Answer
              </button>
            </form>
          </div>
        )}

        {gameState === 'GAMEOVER' && question && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-red-400 text-2xl font-bold mb-4">Incorrect!</div>
            <p className="text-slate-400 mb-8">
              There were <span className="text-white font-bold">{question.answer}</span> {COLORS[question.colorIdx].name} {SHAPE_NAMES[question.shapeIdx]}. You guessed <span className="text-red-400 font-bold">{userInput}</span>.
            </p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('shape', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('shape', score).color}`}>
                  {getIQRank('shape', score).percentile} ({getIQRank('shape', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('shape', score).message}</p>
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

export default ShapeCount;
