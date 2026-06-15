import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Target } from 'lucide-react';
import JournalModal from '../../components/meditation/JournalModal';
import { useAuth } from '../../context/AuthContext';
import { logSession } from '../../api/meditation';

const DURATIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60];

export default function FocusTimer() {
  const { user } = useAuth();
  const [duration, setDuration] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [actualMinutes, setActualMinutes] = useState(0);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Completed!
      setIsActive(false);
      setActualMinutes(duration);
      setShowJournal(true);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const stopTimer = () => {
    setIsActive(false);
    const timeSpent = (duration * 60) - timeLeft;
    const minsSpent = Math.max(1, Math.round(timeSpent / 60));
    setActualMinutes(minsSpent);
    if (timeSpent > 30) { // Only log if they did at least 30 seconds
      setShowJournal(true);
    } else {
      setTimeLeft(duration * 60);
    }
  };

  const handleSaveJournal = async (journalData: any) => {
    if (!user?.token) return;

    try {
      await logSession({
        type: 'Timer',
        durationMinutes: actualMinutes,
        ...journalData
      }, user.token);
      setShowJournal(false);
      setTimeLeft(duration * 60); // Reset
    } catch (error) {
      console.error('Failed to log timer session', error);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate progress circle stroke dashoffset
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (timeLeft / (duration * 60)) * circumference;

  return (
    <div className={`transition-all duration-1000 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center ${isActive ? 'bg-black/40 scale-105 rounded-3xl' : ''}`}>
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-amber-400" />
              Focus Mode
            </h1>
            <p className="text-white/60">Eliminate distractions and be present.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center">
        {/* Progress Circle SVG */}
        <svg className="absolute w-[300px] h-[300px] -rotate-90 transform z-0">
          <circle
            cx="150"
            cy="150"
            r="120"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="150"
            cy="150"
            r="120"
            stroke={isActive ? '#FBBF24' : '#6366F1'} // Amber to Indigo
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 1s linear'
            }}
          />
        </svg>

        {/* Timer Display */}
        <div className="relative z-10 glass w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/5">
          <div className={`text-5xl font-light tracking-wider transition-colors ${isActive ? 'text-amber-400 neon-text-amber' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-white/40 text-xs tracking-[0.2em] mt-2 uppercase">
            {isActive ? 'Focusing' : 'Ready'}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-12 flex flex-wrap justify-center gap-2 max-w-lg"
          >
            {DURATIONS.map((dur) => (
              <button
                key={dur}
                onClick={() => setDuration(dur)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  duration === dur 
                    ? 'bg-indigo-500 text-white shadow-lg' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {dur}m
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex items-center gap-6">
        {isActive ? (
          <>
            <button
              onClick={toggleTimer}
              className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 flex items-center justify-center hover:bg-amber-500/30 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)]"
            >
              <Pause className="h-6 w-6" />
            </button>
            <button
              onClick={stopTimer}
              className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 flex items-center justify-center hover:bg-red-500/30 transition-all"
            >
              <Square className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          >
            <Play className="h-8 w-8 ml-1" />
          </button>
        )}
      </div>

      <JournalModal
        isOpen={showJournal}
        onClose={() => {
          setShowJournal(false);
          setTimeLeft(duration * 60);
        }}
        onSave={handleSaveJournal}
      />
    </div>
  );
}
