import React, { useState, useEffect, useRef } from 'react';
import { Trophy, AlertTriangle, RotateCcw, Brain, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const ChimpTest = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'MEMORIZE' | 'RECALL' | 'GAMEOVER'>('START');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const historyRef = useRef<string[]>([]);
  const initialTimeRef = useRef<number>(100);

  const getGameParams = (currentLevel: number) => {
    switch(difficulty) {
      case 1: return { length: Math.min(3 + currentLevel, 10), timeMultiplier: 1.2 };
      case 2: return { length: Math.min(4 + currentLevel, 12), timeMultiplier: 0.8 };
      case 3: return { length: Math.min(5 + (currentLevel * 2), 15), timeMultiplier: 0.5 };
      default: return { length: Math.min(3 + currentLevel, 10), timeMultiplier: 1.0 };
    }
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    historyRef.current = [];
    generateSequence(1);
  };

  const generateSequence = (currentLevel: number) => {
    const params = getGameParams(currentLevel);
    let newSeq: number[] = [];
    let attempts = 0;
    let seqPrefix = '';

    do {
      newSeq = Array.from({ length: params.length }, () => Math.floor(Math.random() * 10));
      seqPrefix = newSeq.slice(0, 3).join('');
      attempts++;
    } while (historyRef.current.includes(seqPrefix) && attempts < 15);

    historyRef.current.push(seqPrefix);
    if (historyRef.current.length > 3) historyRef.current.shift();

    setSequence(newSeq);
    setGameState('MEMORIZE');
    
    // Time to memorize based on length and difficulty
    const timeToMemorize = Math.max(3, Math.floor(params.length * params.timeMultiplier));
    setTimeLeft(timeToMemorize);
    initialTimeRef.current = timeToMemorize;
  };

  useEffect(() => {
    let timer: number | ReturnType<typeof setTimeout>;
    if (gameState === 'MEMORIZE' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (gameState === 'MEMORIZE' && timeLeft <= 0) {
      setGameState('RECALL');
      setUserInput('');
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'RECALL') return;

    const correctStr = sequence.join('');
    if (userInput === correctStr) {
      setScore(s => s + (level * 100 * difficulty));
      setLevel(l => l + 1);
      generateSequence(level + 1);
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
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12 gap-4 text-slate-300">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" /> 
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-5 h-5 text-purple-400 mr-2" />
          <span className="font-bold">Level: {level}</span>
        </div>
      </div>

      <div className="min-h-[300px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Chimp Test</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Memorize the sequence of numbers. When they disappear, recall them in the exact order.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'MEMORIZE' && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-6xl font-black text-white tracking-widest mb-8 break-words leading-tight">
              {sequence.join(' ')}
            </div>
            <div className="text-purple-400 font-bold flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2 animate-pulse" /> Disappearing in {timeLeft}s
            </div>
            <div className="w-64 h-2 bg-slate-800 rounded-full mt-4 mx-auto overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-1000 linear" 
                style={{ width: `${(timeLeft / Math.max(1, initialTimeRef.current)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === 'RECALL' && (
          <form onSubmit={handleSubmit} className="w-full max-w-md animate-slide-up-fade">
            <label className="block text-slate-400 mb-4">What was the sequence?</label>
            <input 
              type="number"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              className="w-full text-center text-3xl tracking-widest bg-slate-900/80 border-2 border-purple-500/50 rounded-2xl p-4 text-white focus:border-purple-400 focus:outline-none mb-6 font-mono"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!userInput}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition-colors text-lg"
            >
              Submit Answer
            </button>
          </form>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade">
            <div className="text-red-400 text-2xl font-bold mb-4">Incorrect!</div>
            <p className="text-slate-400 mb-2">The sequence was: <span className="text-white font-mono tracking-widest">{sequence.join('')}</span></p>
            <p className="text-slate-400 mb-8">You answered: <span className="text-red-400 font-mono tracking-widest">{userInput}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('chimp', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('chimp', score).color}`}>
                  {getIQRank('chimp', score).percentile} ({getIQRank('chimp', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('chimp', score).message}</p>
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

export default ChimpTest;
