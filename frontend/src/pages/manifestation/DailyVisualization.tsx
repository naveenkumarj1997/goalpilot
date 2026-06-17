import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Play, Pause, Square, CheckCircle, Headphones } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addManifestationActivity } from '../../api/manifestation';

export default function DailyVisualization() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState<any>(null);
  const [completed, setCompleted] = useState(false);

  const sessions = [
    { id: 'job', title: 'Dream Career Success', duration: 300, icon: '💼', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'wealth', title: 'Financial Abundance', duration: 300, icon: '💰', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'body', title: 'Peak Health & Fitness', duration: 300, icon: '🏃‍♂️', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'confidence', title: 'Unshakeable Confidence', duration: 300, icon: '🦁', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
  ];

  const startSession = (session: any) => {
    setActiveSession(session);
    setTimer(session.duration);
    setIsActive(true);
    setCompleted(false);
    
    const id = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(id);
          finishSession(session);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const pauseResume = () => {
    if (isActive) {
      clearInterval(intervalId);
      setIsActive(false);
    } else {
      setIsActive(true);
      const id = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(id);
            finishSession(activeSession);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopSession = () => {
    clearInterval(intervalId);
    setActiveSession(null);
    setIsActive(false);
  };

  const finishSession = async (session: any) => {
    setIsActive(false);
    setCompleted(true);
    try {
      if (user?.token) {
        await addManifestationActivity({
          type: 'Visualization',
          category: session.title,
          durationMinutes: Math.round(session.duration / 60)
        }, user.token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 text-center">
      <div className="mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Daily Visualization</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Close your eyes, play some ambient music, and visualize your goals as if they have already happened.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!activeSession && !completed && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {sessions.map(s => (
              <div key={s.id} onClick={() => startSession(s)} className={`glass p-8 rounded-3xl border cursor-pointer hover:scale-105 transition-transform ${s.color}`}>
                <div className="text-6xl mb-4">{s.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-white">{s.title}</h3>
                <p className="font-medium opacity-80 flex items-center justify-center">
                  <Headphones className="w-4 h-4 mr-2" /> 5 Minutes
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {activeSession && !completed && (
          <motion.div 
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass max-w-xl mx-auto rounded-3xl p-12 border border-white/10 relative overflow-hidden"
          >
            <div className={`absolute inset-0 opacity-10 animate-pulse ${activeSession.color.split(' ')[0]}`} />
            
            <div className="relative z-10">
              <div className="text-6xl mb-6">{activeSession.icon}</div>
              <h2 className="text-3xl font-black text-white mb-2">{activeSession.title}</h2>
              <p className="text-slate-400 mb-8">Close your eyes and visualize every detail.</p>
              
              <div className="text-8xl font-black text-white mb-12 tabular-nums tracking-tighter">
                {formatTime(timer)}
              </div>
              
              <div className="flex items-center justify-center gap-6">
                <button onClick={stopSession} className="p-4 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors">
                  <Square className="w-8 h-8" />
                </button>
                <button onClick={pauseResume} className="p-6 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {completed && (
          <motion.div 
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass max-w-md mx-auto rounded-3xl p-12 border border-emerald-500/30 text-center"
          >
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Session Complete!</h2>
            <p className="text-emerald-400 font-bold mb-8">+10 Manifestation Score</p>
            <button onClick={() => setCompleted(false)} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors">
              Return to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}