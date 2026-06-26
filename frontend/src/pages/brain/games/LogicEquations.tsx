import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Timer, Activity } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const LogicEquations = ({ onBack }: { onBack: () => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [statement, setStatement] = useState('');
  const [question, setQuestion] = useState('');
  const [isTrue, setIsTrue] = useState(true);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    generateLogic();
  };

  const generateLogic = () => {
    const vars = ['A', 'B', 'C', 'X', 'Y', 'Z'];
    const v1 = vars[Math.floor(Math.random() * vars.length)];
    let v2 = vars[Math.floor(Math.random() * vars.length)];
    while (v2 === v1) v2 = vars[Math.floor(Math.random() * vars.length)];
    let v3 = vars[Math.floor(Math.random() * vars.length)];
    while (v3 === v1 || v3 === v2) v3 = vars[Math.floor(Math.random() * vars.length)];

    const templates = [
      {
        text: `If ${v1} > ${v2} and ${v2} > ${v3}`,
        qTrue: `Is ${v1} > ${v3}?`,
        qFalse: `Is ${v3} > ${v1}?`
      },
      {
        text: `If ${v1} is heavier than ${v2}, and ${v2} is heavier than ${v3}`,
        qTrue: `Is ${v1} the heaviest?`,
        qFalse: `Is ${v3} heavier than ${v1}?`
      },
      {
        text: `If ${v1} = ${v2} and ${v2} > ${v3}`,
        qTrue: `Is ${v1} > ${v3}?`,
        qFalse: `Is ${v3} > ${v1}?`
      },
      {
        text: `If ${v1} is faster than ${v2}, but slower than ${v3}`,
        qTrue: `Is ${v3} faster than ${v2}?`,
        qFalse: `Is ${v2} faster than ${v3}?`
      }
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const correctAnswerIsTrue = Math.random() > 0.5;

    setStatement(template.text);
    setQuestion(correctAnswerIsTrue ? template.qTrue : template.qFalse);
    setIsTrue(correctAnswerIsTrue);
    setTimeLeft(100); // Reset timer to 10 seconds (100%)
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING') {
      // 10 seconds total. 100% / 100 steps = 1 step per 100ms
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            setGameState('GAMEOVER');
            return 0;
          }
          return t - 1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleAnswer = (answer: boolean) => {
    if (gameState !== 'PLAYING') return;

    if (answer === isTrue) {
      setScore(s => s + (100 * difficulty));
      generateLogic();
    } else {
      setGameState('GAMEOVER');
    }
  };

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-8 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] text-center">
      <div className="flex justify-between items-center mb-8 text-slate-300">
        <div className="flex items-center">
          <Search className="w-5 h-5 text-blue-400 mr-2" />
          <span className="font-bold text-blue-400">Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[300px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-3xl font-bold text-white mb-4">Logic Equations</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Read the premise and quickly deduce if the conclusion is True or False.
            </p>
            
            <div className="flex gap-4 justify-center mb-8">
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
            <div className="flex items-center justify-center mb-8">
              <Timer className="w-5 h-5 text-slate-400 mr-2" />
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 linear ${timeLeft > 50 ? 'bg-blue-500' : timeLeft > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${timeLeft}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-lg mx-auto">
              <p className="text-slate-400 text-lg mb-4">Premise:</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">{statement}</h3>
            </div>

            <h4 className="text-xl md:text-2xl font-bold text-blue-400 mb-12">{question}</h4>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => handleAnswer(false)}
                className="flex-1 max-w-[150px] py-4 bg-red-600/20 hover:bg-red-500/40 border border-red-500/50 text-red-400 font-bold rounded-2xl text-2xl transition-all"
              >
                FALSE
              </button>
              <button 
                onClick={() => handleAnswer(true)}
                className="flex-1 max-w-[150px] py-4 bg-emerald-600/20 hover:bg-emerald-500/40 border border-emerald-500/50 text-emerald-400 font-bold rounded-2xl text-2xl transition-all"
              >
                TRUE
              </button>
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="animate-slide-up-fade">
            <div className="text-red-400 text-3xl font-black mb-2">Logic Error!</div>
            <p className="text-slate-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('logic', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('logic', score).color}`}>
                  {getIQRank('logic', score).percentile} ({getIQRank('logic', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('logic', score).message}</p>
            </div>

            <button 
              onClick={startGame}
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

export default LogicEquations;
