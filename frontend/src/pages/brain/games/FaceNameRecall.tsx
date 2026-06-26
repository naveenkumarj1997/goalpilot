import React, { useState, useEffect } from 'react';
import { User, RotateCcw, Activity, XCircle, Users } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Quinn', 'Avery', 'Skyler', 'Cameron', 'Dakota', 'Peyton', 'Reese', 'Drew', 'Blake'];
const AVATAR_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500'];

type Person = {
  name: string;
  color: string;
};

const FaceNameRecall = ({ onBack }: { onBack: () => void }) => {
  const [gameState, setGameState] = useState<'START' | 'MEMORIZE' | 'QUESTION' | 'GAMEOVER'>('START');
  const [people, setPeople] = useState<Person[]>([]);
  const [targetPerson, setTargetPerson] = useState<Person | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(100);

  const startGame = () => {
    setScore(0);
    generatePeople();
  };

  const generatePeople = () => {
    const numPeople = difficulty === 1 ? 3 : difficulty === 2 ? 5 : 8;
    const shuffledNames = [...NAMES].sort(() => Math.random() - 0.5);
    const shuffledColors = [...AVATAR_COLORS].sort(() => Math.random() - 0.5);
    
    const newPeople: Person[] = [];
    for (let i = 0; i < numPeople; i++) {
      newPeople.push({
        name: shuffledNames[i],
        color: shuffledColors[i % AVATAR_COLORS.length]
      });
    }

    setPeople(newPeople);
    setGameState('MEMORIZE');
    setTimeLeft(100);

    // Memorize time: Easy 5s, Med 5s, Hard 5s (but more people)
    let timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 2) {
          clearInterval(timer);
          askQuestion(newPeople);
          return 0;
        }
        return t - 2; // 50 steps of 2% = 50 * 100ms = 5 seconds
      });
    }, 100);
  };

  const askQuestion = (currentPeople: Person[]) => {
    const target = currentPeople[Math.floor(Math.random() * currentPeople.length)];
    setTargetPerson(target);

    let opts = currentPeople.map(p => p.name).sort(() => Math.random() - 0.5);
    // If easy, we only have 3 names, add a random fake one to make 4 options
    while (opts.length < 4) {
      const fakeName = NAMES[Math.floor(Math.random() * NAMES.length)];
      if (!opts.includes(fakeName)) opts.push(fakeName);
    }
    opts = opts.slice(0, 4);
    if (!opts.includes(target.name)) {
      opts[0] = target.name;
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setGameState('QUESTION');
  };

  const handleGuess = (guess: string) => {
    if (gameState !== 'QUESTION' || !targetPerson) return;

    if (guess === targetPerson.name) {
      setScore(s => s + (150 * difficulty));
      generatePeople();
    } else {
      setGameState('GAMEOVER');
    }
  };

  return (
    <div className="glass max-w-2xl mx-auto w-full rounded-3xl p-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] text-center">
      <div className="flex justify-between items-center mb-8 text-slate-300">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-cyan-400 mr-2" />
          <span className="font-bold text-cyan-400">Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-3xl font-bold text-white mb-4">Face-Name Recall</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Memorize the faces and their names. When they vanish, you must identify one of them.
            </p>
            
            <div className="flex gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy (3 Faces)</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med (5 Faces)</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard (8 Faces)</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'MEMORIZE' && (
          <div className="animate-slide-up-fade w-full">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8 max-w-md mx-auto">
              <div 
                className="h-full bg-cyan-500 transition-all duration-75 linear"
                style={{ width: `${timeLeft}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center max-w-lg mx-auto">
              {people.map((person, idx) => (
                <div key={idx} className="flex flex-col items-center animate-slide-up-fade" style={{ animationDelay: `${idx * 0.1}s`}}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg ${person.color}`}>
                    <User className="w-8 h-8 text-white/80" />
                  </div>
                  <div className="bg-slate-800 px-4 py-1 rounded-full border border-slate-700 font-bold text-white shadow-sm">
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'QUESTION' && targetPerson && (
          <div className="animate-slide-up-fade w-full">
            <h3 className="text-2xl font-bold text-white mb-8">What is this person's name?</h3>
            
            <div className="flex justify-center mb-10">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/20 ${targetPerson.color}`}>
                <User className="w-16 h-16 text-white/80" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGuess(opt)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-white font-bold rounded-xl text-xl transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && targetPerson && (
          <div className="animate-slide-up-fade">
            <div className="text-red-400 text-2xl font-bold mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 mr-2" /> Identity Forgotten!
            </div>
            <p className="text-slate-400 mb-2">That was <span className="text-cyan-400 font-bold">{targetPerson.name}</span></p>
            <p className="text-slate-400 mb-8">Final Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('face', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('face', score).color}`}>
                  {getIQRank('face', score).percentile} ({getIQRank('face', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('face', score).message}</p>
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

export default FaceNameRecall;
