import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Target } from 'lucide-react';
import { logWorkout } from '../../api/combat';

const ShadowBoxing = () => {
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  
  // Settings
  const [totalRounds, setTotalRounds] = useState(3);
  const [roundTime, setRoundTime] = useState(180); // seconds (3 mins)
  const [restTime, setRestTime] = useState(60); // seconds (1 min)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioGuide, setAudioGuide] = useState(true); // Call out combos

  // Timer state
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastComboTimeRef = useRef<number>(0);

  const combos = [
    "Jab",
    "Double Jab",
    "One, Two",
    "Jab, Cross",
    "One, Two, Hook",
    "Jab, Cross, Hook",
    "Slip left, hook",
    "Slip right, cross",
    "One, Two, Slip, Cross",
    "Jab, body cross",
    "Hook, cross",
    "Uppercut, hook, cross",
    "Roll under, hook"
  ];

  // Initialize Audio Context on user interaction to bypass browser restrictions
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playBeep = (freq = 800, duration = 200, type: OscillatorType = 'sine') => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  };

  const playBell = () => {
    // A classic boxing bell sound approximated using two oscillators
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') ctx.resume();

    const duration = 1.5;
    const freqs = [600, 850]; // Harmonics for a metallic bell

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Sharp attack, long decay
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // End of round or rest
            if (isResting) {
              // Rest ended, new round starts
              if (currentRound < totalRounds) {
                setIsResting(false);
                setCurrentRound(r => r + 1);
                playBell();
                return roundTime;
              } else {
                // Workout complete
                handleWorkoutComplete();
                return 0;
              }
            } else {
              // Round ended, rest starts
              playBell();
              if (currentRound < totalRounds) {
                setIsResting(true);
                return restTime;
              } else {
                handleWorkoutComplete();
                return 0;
              }
            }
          }
          
          // 10 second warning beep
          if (prev === 11 && !isResting) {
            playBeep(1000, 300, 'square');
          }

          return prev - 1;
        });

        if (!isResting) {
           setTotalTimeElapsed(prev => prev + 1);

           // Audio Guided Combos
           if (audioGuide && soundEnabled) {
             const now = Date.now();
             // At least 4 seconds between combos
             if (now - lastComboTimeRef.current > 4000) {
               // 30% chance every second to call a combo
               if (Math.random() < 0.3) {
                 const combo = combos[Math.floor(Math.random() * combos.length)];
                 const utterance = new SpeechSynthesisUtterance(combo);
                 utterance.rate = 1.3;
                 utterance.pitch = 0.9;
                 window.speechSynthesis.speak(utterance);
                 lastComboTimeRef.current = now;
               }
             }
           }
        } else {
           window.speechSynthesis.cancel(); // Stop talking during rest
        }

      }, 1000);
    } else {
       window.speechSynthesis.cancel();
    }

    return () => clearInterval(interval);
  }, [isActive, isResting, currentRound, totalRounds, roundTime, restTime]);

  const handleWorkoutComplete = async () => {
    setIsActive(false);
    playBell();
    setTimeout(() => playBell(), 500); // Double bell for end of workout
    
    try {
      const minutes = Math.ceil(totalTimeElapsed / 60);
      await logWorkout({
        type: 'Shadow Boxing',
        title: `${totalRounds} Rounds Shadow Boxing`,
        duration: minutes,
        rounds: totalRounds,
        calories: minutes * 12 // rough estimate
      });
      alert('Workout complete! Saved to your progress.');
    } catch (err) {
      console.error('Failed to log workout', err);
    }
  };

  const toggleTimer = () => {
    initAudio();
    if (!isActive && currentRound === 1 && timeLeft === roundTime) {
       playBell(); // Start bell
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsResting(false);
    setCurrentRound(1);
    setTimeLeft(roundTime);
    setTotalTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isResting 
    ? ((restTime - timeLeft) / restTime) * 100 
    : ((roundTime - timeLeft) / roundTime) * 100;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-slide-up-fade relative">
      
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl font-black text-white neon-text-brand mb-2 italic uppercase tracking-tight">Shadow Boxing</h1>
        <p className="text-slate-400 text-lg">Audio-guided rounds for your solo training.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Timer UI */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 border border-red-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.15)]">
          
          {/* Character Art Background Overlay */}
          <div className="absolute right-[-10%] bottom-[-10%] w-64 opacity-30 pointer-events-none mix-blend-screen">
             <img src="/images/combat/boxer_shadow.png" alt="Training" className="w-full h-auto object-contain" />
          </div>

          {/* Animated Background Ring */}
          <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${isResting ? 'bg-blue-500' : 'bg-red-500'}`}></div>
          
          <h2 className="text-2xl font-bold text-slate-300 z-10 mb-2">
            {isResting ? 'Resting' : `Round ${currentRound} of ${totalRounds}`}
          </h2>
          
          <div className="relative w-64 h-64 flex items-center justify-center my-8 z-10">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke={isResting ? '#3B82F6' : '#EF4444'} // Blue for rest, Red for work
                strokeWidth="12"
                strokeDasharray="753.98" // 2 * PI * 120
                strokeDashoffset={753.98 - (753.98 * progress) / 100}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className={`text-6xl font-bold font-mono ${isResting ? 'text-blue-400' : 'text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex gap-6 z-10">
            <button 
              onClick={resetTimer}
              className="p-4 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-8 h-8" />
            </button>
            <button 
              onClick={toggleTimer}
              className={`p-4 rounded-full text-white shadow-lg transition-all transform hover:scale-110 ${
                isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="glass rounded-3xl p-6 border border-emerald-500/20 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-brand" /> Settings
            </h3>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg ${soundEnabled ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 bg-slate-800'}`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-3 bg-brand/10 border border-brand/30 rounded-xl">
              <div>
                <label className="block text-sm font-bold text-brand">Audio Coach</label>
                <p className="text-xs text-slate-400">Calls out random boxing combinations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={audioGuide} onChange={() => setAudioGuide(!audioGuide)} disabled={isActive} />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Number of Rounds: {totalRounds}</label>
              <input 
                type="range" min="1" max="15" step="1" 
                value={totalRounds} 
                onChange={(e) => setTotalRounds(parseInt(e.target.value))}
                disabled={isActive}
                className="w-full accent-brand"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Round Length</label>
              <select 
                value={roundTime} 
                onChange={(e) => {
                  setRoundTime(parseInt(e.target.value));
                  if (!isActive) setTimeLeft(parseInt(e.target.value));
                }}
                disabled={isActive}
                className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand"
              >
                <option value={60}>1 Minute</option>
                <option value={120}>2 Minutes</option>
                <option value={180}>3 Minutes (Pro)</option>
                <option value={300}>5 Minutes (MMA)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Rest Period</label>
              <select 
                value={restTime} 
                onChange={(e) => setRestTime(parseInt(e.target.value))}
                disabled={isActive}
                className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand"
              >
                <option value={30}>30 Seconds</option>
                <option value={45}>45 Seconds</option>
                <option value={60}>1 Minute</option>
                <option value={90}>1.5 Minutes</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 border-t border-emerald-500/20">
            <p className="text-xs text-slate-400">
              A 10-second warning beep will sound before the end of each round.
              Keep your hands up!
            </p>
          </div>
        </div>

      </div>

      {/* Tutorial Section */}
      <div className="mt-12 mb-8 glass rounded-3xl p-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Play className="w-8 h-8 mr-3 text-brand" />
          How to Shadow Box
        </h2>
        <div className="aspect-w-16 aspect-h-9 w-full bg-black rounded-2xl overflow-hidden border border-emerald-500/30">
          <iframe 
            src="https://www.youtube.com/embed/SjLXzCpRS8U" 
            title="Shadow Boxing Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full min-h-[400px]"
          ></iframe>
        </div>
        <p className="text-slate-400 mt-4 text-sm max-w-3xl">
          Watch this tutorial to understand the fundamentals of stance, movement, and how to throw punches properly before you begin your shadow boxing session.
        </p>
      </div>

    </div>
  );
};

export default ShadowBoxing;
