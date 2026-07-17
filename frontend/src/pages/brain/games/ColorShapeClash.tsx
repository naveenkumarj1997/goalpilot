import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Brain, Activity, SplitSquareVertical } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const ALL_SHAPES = ['●', '■', '▲', '★', '◆', '⬢', '✚', '♥'];
const ALL_SHAPE_NAMES = ['Circle', 'Square', 'Triangle', 'Star', 'Diamond', 'Hexagon', 'Cross', 'Heart'];
const ALL_COLORS = [
  { name: 'Red', class: 'text-red-500' },
  { name: 'Blue', class: 'text-blue-500' },
  { name: 'Green', class: 'text-green-500' },
  { name: 'Yellow', class: 'text-yellow-500' },
  { name: 'Purple', class: 'text-purple-500' },
  { name: 'Orange', class: 'text-orange-500' },
  { name: 'Pink', class: 'text-pink-500' },
  { name: 'Cyan', class: 'text-cyan-500' }
];

type TargetType = 'COLOR' | 'SHAPE';

const ColorShapeClash = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [difficulty, setDifficulty] = useState(1);
  
  const [prompt, setPrompt] = useState<{ type: TargetType, value: string, isNot: boolean }>({ type: 'COLOR', value: 'Red', isNot: false });
  const [leftSide, setLeftSide] = useState<{ shape: string, colorClass: string }>({ shape: '●', colorClass: 'text-red-500' });
  const [rightSide, setRightSide] = useState<{ text: string, colorClass: string }>({ text: 'Blue', colorClass: 'text-green-500' });
  const [correctSide, setCorrectSide] = useState<'LEFT' | 'RIGHT'>('LEFT');

  const gameTimer = useRef<any>(null);
  const historyRef = useRef<string>('');

  const getGameParams = () => {
    switch (difficulty) {
      case 1: return { time: 45, numShapes: 3, numColors: 3, allowNot: false };
      case 2: return { time: 30, numShapes: 5, numColors: 5, allowNot: false };
      case 3: return { time: 20, numShapes: 8, numColors: 8, allowNot: true };
      default: return { time: 30, numShapes: 3, numColors: 3, allowNot: false };
    }
  };

  const startGame = () => {
    const params = getGameParams();
    setScore(0);
    setTimeRemaining(params.time);
    historyRef.current = '';
    setGameState('PLAYING');
    generateRound();
  };

  const generateRound = () => {
    const params = getGameParams();
    const shapes = ALL_SHAPES.slice(0, params.numShapes);
    const shapeNames = ALL_SHAPE_NAMES.slice(0, params.numShapes);
    const colors = ALL_COLORS.slice(0, params.numColors);

    // Determine the answer side randomly
    const answerSide = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
    setCorrectSide(answerSide);

    // Pick a random target
    const isColorTarget = Math.random() > 0.5;
    const isNot = params.allowNot && Math.random() > 0.7; // 30% chance of NOT logic on hard mode
    let targetValue = '';
    
    // Prevent repetition
    let attempts = 0;
    do {
      if (isColorTarget) {
        targetValue = colors[Math.floor(Math.random() * colors.length)].name;
      } else {
        targetValue = shapeNames[Math.floor(Math.random() * shapeNames.length)];
      }
      attempts++;
    } while (targetValue === historyRef.current && attempts < 10);
    historyRef.current = targetValue;

    if (isColorTarget) {
      setPrompt({ type: 'COLOR', value: targetValue, isNot });
    } else {
      setPrompt({ type: 'SHAPE', value: targetValue, isNot });
    }

    // Logic for generating sides based on NOT condition
    // If NOT condition, the "correct" side is actually the one that DOES NOT have the target
    // To make it simple, we just generate standard logic, but invert the assignment of correctSide.
    const logicalTargetSide = isNot ? (answerSide === 'LEFT' ? 'RIGHT' : 'LEFT') : answerSide;

    // Generate Left Side (Visual Shape)
    let leftShapeIdx = Math.floor(Math.random() * shapes.length);
    let leftColorIdx = Math.floor(Math.random() * colors.length);
    
    // Generate Right Side (Linguistic Text)
    const rightIsColorName = Math.random() > 0.5;
    let rightText = '';
    let rightColorIdx = Math.floor(Math.random() * colors.length);

    if (rightIsColorName) {
      rightText = colors[Math.floor(Math.random() * colors.length)].name;
    } else {
      rightText = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    }

    if (logicalTargetSide === 'LEFT') {
      // Make Left Side logically match the target
      if (isColorTarget) {
        leftColorIdx = colors.findIndex(c => c.name === targetValue);
      } else {
        leftShapeIdx = shapeNames.findIndex(s => s === targetValue);
      }
      // Make Right Side logically WRONG
      while (rightText === targetValue) {
        rightText = rightIsColorName ? colors[Math.floor(Math.random() * colors.length)].name : shapeNames[Math.floor(Math.random() * shapeNames.length)];
      }
    } else {
      // Make Right Side logically match the target
      rightText = targetValue;
      // Make Left Side logically WRONG
      if (isColorTarget) {
        while (colors[leftColorIdx].name === targetValue) leftColorIdx = Math.floor(Math.random() * colors.length);
      } else {
        while (shapeNames[leftShapeIdx] === targetValue) leftShapeIdx = Math.floor(Math.random() * shapes.length);
      }
    }

    setLeftSide({ shape: shapes[leftShapeIdx], colorClass: colors[leftColorIdx].class });
    setRightSide({ text: rightText, colorClass: colors[rightColorIdx].class });
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameTimer.current = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setGameState('GAMEOVER');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (gameTimer.current) clearInterval(gameTimer.current);
    };
  }, [gameState]);

  const handleChoice = (side: 'LEFT' | 'RIGHT') => {
    if (gameState !== 'PLAYING') return;
    
    if (side === correctSide) {
      setScore(s => s + (100 * difficulty));
      generateRound();
    } else {
      setScore(s => Math.max(0, s - (50 * difficulty)));
      generateRound();
    }
  };

  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      onGameOver?.(score);
    }
  }, [gameState]);

  return (
    <div className="glass max-w-4xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-fuchsia-500/30 shadow-[0_0_40px_rgba(217,70,239,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-fuchsia-400 mr-2" />
          <span className="font-bold">Neural Connectivity</span>
        </div>
      </div>

      <div className="min-h-[450px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Color Shape Clash</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              You will be given a target (e.g. "Find Red"). <br/><br/>
              Click the <span className="text-fuchsia-400 font-bold">Left Panel</span> if the physical shape matches the target.<br/>
              Click the <span className="text-emerald-400 font-bold">Right Panel</span> if the written text matches the target.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (45s)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (30s)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (20s)</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Clash
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="animate-slide-up-fade w-full flex flex-col items-center">
            
            <div className="mb-6 flex flex-col items-center">
              <span className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-1">Target</span>
              <div className="px-6 py-2 bg-fuchsia-500/20 text-fuchsia-300 font-bold text-2xl rounded-xl border border-fuchsia-500/50">
                {prompt.isNot ? 'Find NOT ' : 'Find '}{prompt.value}
              </div>
              <p className="text-slate-500 font-mono mt-4">Time: {timeRemaining}s</p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full max-w-3xl gap-4 sm:h-64 h-auto">
              {/* Left Panel - Visual/Spatial */}
              <button 
                onClick={(e) => { e.preventDefault(); handleChoice('LEFT'); }}
                onPointerDown={(e) => { e.preventDefault(); handleChoice('LEFT'); }}
                className="flex-1 py-8 sm:py-0 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-fuchsia-500/50 rounded-2xl flex items-center justify-center transition-all group active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className={`text-9xl ${leftSide.colorClass} drop-shadow-lg transition-transform`}>
                    {leftSide.shape}
                  </span>
                  <span className="text-slate-500 font-bold mt-4 opacity-50 group-hover:opacity-100 uppercase tracking-widest">Visual</span>
                </div>
              </button>

              {/* Right Panel - Linguistic */}
              <button 
                onClick={(e) => { e.preventDefault(); handleChoice('RIGHT'); }}
                onPointerDown={(e) => { e.preventDefault(); handleChoice('RIGHT'); }}
                className="flex-1 py-8 sm:py-0 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-fuchsia-500/50 rounded-2xl flex items-center justify-center transition-all group active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className={`text-4xl sm:text-5xl font-black ${rightSide.colorClass} drop-shadow-lg transition-transform`}>
                    {rightSide.text}
                  </span>
                  <span className="text-slate-500 font-bold mt-8 opacity-50 group-hover:opacity-100 uppercase tracking-widest">Text</span>
                </div>
              </button>
            </div>
            
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade w-full">
            <div className="flex justify-center items-center text-fuchsia-400 text-2xl font-bold mb-8">
              <SplitSquareVertical className="w-8 h-8 mr-2" /> Synapses Fired!
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('clash', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('clash', score).color}`}>
                  {getIQRank('clash', score).percentile} ({getIQRank('clash', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('clash', score).message}</p>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Clash Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorShapeClash;
