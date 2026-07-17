import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Activity, XCircle, HeartHandshake } from 'lucide-react';
import { getIQRank } from '../../../utils/iqScorer';

const REFRAMES = [
  { 
    negative: "I am always broke.", 
    positive: "Wealth flows to me abundantly and effortlessly.",
    fakes: ["I hope I get some money soon.", "I need to work harder for pennies.", "Money is evil anyway.", "If I win the lottery I will be happy.", "I will try to save more."]
  },
  { 
    negative: "I will never get the job.", 
    positive: "I am perfectly aligned with my dream career.",
    fakes: ["Other people are just luckier than me.", "I guess I'll settle for less.", "I'm underqualified for everything.", "The interviewers always hate me.", "I will just keep applying to random jobs."]
  },
  { 
    negative: "Nobody understands me.", 
    positive: "I attract loving, like-minded people into my life.",
    fakes: ["I'm meant to be alone forever.", "People are just selfish.", "I need to change who I am.", "It's safer to not trust anyone.", "Everyone leaves eventually."]
  },
  { 
    negative: "I don't have enough time.", 
    positive: "I am in complete control of my schedule and time flows abundantly.",
    fakes: ["I'm always running late.", "There are never enough hours.", "I'm constantly overwhelmed.", "I will sleep less to get more done.", "I have to do everything myself."]
  },
  { 
    negative: "I always fail at this.", 
    positive: "Every experience is a stepping stone to my inevitable success.",
    fakes: ["I should just give up now.", "Some people have it, I don't.", "Failure is my destiny.", "I will never learn.", "It is probably rigged against me."]
  },
  { 
    negative: "I am not attractive enough.", 
    positive: "I radiate confidence and inner beauty that attracts positivity.",
    fakes: ["I need to fix my appearance.", "If only I looked like them.", "Nobody looks at me.", "I should buy more expensive clothes.", "It's all about genetics anyway."]
  }
];

const PositiveReframing = ({ onBack, onGameOver }: { onBack: () => void, onGameOver?: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [currentSet, setCurrentSet] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const historyRef = useRef<string[]>([]);

  const getOptionsCount = () => {
    switch(difficulty) {
      case 1: return 3; // 1 correct, 2 fake
      case 2: return 4; // 1 correct, 3 fake
      case 3: return 6; // 1 correct, 5 fake
      default: return 3;
    }
  };

  const startGame = () => {
    setScore(0);
    historyRef.current = [];
    generateReframe();
  };

  const generateReframe = () => {
    let randomSet: any = null;
    let attempts = 0;
    
    do {
      randomSet = REFRAMES[Math.floor(Math.random() * REFRAMES.length)];
      attempts++;
    } while (historyRef.current.includes(randomSet.negative) && attempts < 10);
    
    historyRef.current.push(randomSet.negative);
    if (historyRef.current.length > Math.floor(REFRAMES.length / 2)) {
      historyRef.current.shift();
    }

    setCurrentSet(randomSet);
    
    const count = getOptionsCount();
    const shuffledFakes = [...randomSet.fakes].sort(() => Math.random() - 0.5).slice(0, count - 1);
    
    const opts = [randomSet.positive, ...shuffledFakes];
    setOptions(opts.sort(() => Math.random() - 0.5));
    setGameState('PLAYING');
  };

  const handleGuess = (guess: string) => {
    if (gameState !== 'PLAYING') return;

    if (guess === currentSet.positive) {
      setScore(s => s + (100 * difficulty));
      generateReframe();
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
    <div className="glass max-w-3xl mx-auto w-full rounded-3xl p-4 sm:p-8 border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.15)] text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 text-slate-300">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 text-pink-400 mr-2" />
          <span className="font-bold text-pink-400">Vibration Score: {score}</span>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {gameState === 'START' && (
          <div className="animate-slide-up-fade">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Positive Reframing</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Rewire your subconscious. When a limiting belief appears, identify the high-vibration manifestation reframe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8">
              <button onClick={() => setDifficulty(1)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 1 ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Easy</button>
              <button onClick={() => setDifficulty(2)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 2 ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Med</button>
              <button onClick={() => setDifficulty(3)} className={`py-2 px-6 rounded-xl font-bold transition-all ${difficulty === 3 ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400'}`}>Hard</button>
            </div>

            <button 
              onClick={startGame}
              className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl text-xl transition-all shadow-lg hover:scale-105"
            >
              Start Practice
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && currentSet && (
          <div className="animate-slide-up-fade w-full">
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 mb-10 max-w-lg mx-auto shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-3">Limiting Belief</p>
              <h3 className="text-2xl md:text-3xl font-black text-white italic">"{currentSet.negative}"</h3>
            </div>

            <p className="text-pink-400 font-bold mb-6 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 mr-2" /> Choose the Manifestation Reframe
            </p>

            <div className={`grid gap-4 max-w-3xl mx-auto ${difficulty === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); handleGuess(opt); }}
                  onPointerDown={(e) => { e.preventDefault(); handleGuess(opt); }}
                  className="py-6 px-4 bg-slate-800/80 hover:bg-slate-700 hover:bg-pink-900/20 border border-slate-700 hover:border-pink-500/50 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-md flex items-center justify-center text-center leading-tight min-h-[100px] active:scale-95 touch-manipulation"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && currentSet && (
          <div className="animate-slide-up-fade w-full">
            <div className="text-red-400 text-2xl font-bold mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 mr-2" /> Alignment Broken!
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8 max-w-md mx-auto text-left">
              <p className="text-slate-400 mb-2">The correct high-vibration reframe was:</p>
              <p className="text-pink-400 font-bold text-lg italic">"{currentSet.positive}"</p>
            </div>
            
            <p className="text-slate-400 mb-8">Vibration Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 mb-8 max-w-sm mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Activity className={`w-6 h-6 mr-2 ${getIQRank('reframe', score).color}`} />
                <span className={`text-xl font-black ${getIQRank('reframe', score).color}`}>
                  {getIQRank('reframe', score).percentile} ({getIQRank('reframe', score).title})
                </span>
              </div>
              <p className="text-slate-400 text-sm">{getIQRank('reframe', score).message}</p>
            </div>

            <button 
              onClick={() => setGameState('START')}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Realign
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositiveReframing;
