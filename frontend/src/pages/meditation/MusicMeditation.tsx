import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Music, ArrowLeft } from 'lucide-react';
import JournalModal from '../../components/meditation/JournalModal';
import { useAuth } from '../../context/AuthContext';
import { logSession } from '../../api/meditation';
import { useNavigate } from 'react-router-dom';

const DURATIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60];

const MUSIC_TRACKS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Girl - Relaxing Beats' },
  { id: 'lFcSrYw-ARY', title: 'Deep Ambient Relaxation' },
  { id: '1ZYbU82GVz4', title: '4K Nature Sounds' },
  { id: 'Wsy2L9VvX90', title: 'Space Ambient Music' },
  { id: '5qap5aO4i9A', title: 'Lofi Hip Hop Radio' }
];

export default function MusicMeditation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [duration, setDuration] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [actualMinutes, setActualMinutes] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(MUSIC_TRACKS[0]);

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
        type: 'Music',
        durationMinutes: actualMinutes,
        notes: `Music Track: ${selectedTrack.title}\n${journalData.notes || ''}`,
        moodBefore: journalData.moodBefore,
        moodAfter: journalData.moodAfter
      }, user.token);
      setShowJournal(false);
      navigate('/meditation/progress');
    } catch (error) {
      console.error('Failed to log music session', error);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (timeLeft / (duration * 60)) * circumference;

  return (
    <div className={`transition-all duration-1000 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center relative overflow-hidden ${isActive ? 'bg-black/80 scale-105 rounded-3xl' : ''}`}>
      
      {/* Background YouTube Video */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-0 hidden'}`}>
        {isActive && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${selectedTrack.id}?autoplay=1&controls=0&mute=0&loop=1&playlist=${selectedTrack.id}&modestbranding=1`}
            title="Music Player"
            className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.5]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ border: 'none' }}
          />
        )}
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {!isActive && (
          <div className="w-full flex justify-start mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
        )}

        <AnimatePresence>
          {!isActive && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Music className="h-8 w-8 text-fuchsia-400" />
                Music Meditation
              </h1>
              <p className="text-white/60">Choose your vibe and meditate with music.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-12 w-full max-w-2xl"
            >
              <h3 className="text-sm font-medium text-white/70 mb-4 text-center">Select Track</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {MUSIC_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track)}
                    className={`p-3 rounded-xl border text-sm transition-all text-left flex items-center gap-2 ${
                      selectedTrack.id === track.id
                        ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                        : 'border-white/10 glass text-white/70 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <Music className={`h-4 w-4 ${selectedTrack.id === track.id ? 'text-fuchsia-400' : 'text-white/30'}`} />
                    <span className="truncate">{track.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center justify-center my-8">
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
              stroke={isActive ? '#D946EF' : '#6366F1'} // Fuchsia to Indigo
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
          <div className="relative z-10 glass w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/5 backdrop-blur-md">
            <div className={`text-5xl font-light tracking-wider transition-colors ${isActive ? 'text-fuchsia-400 neon-text-fuchsia' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-white/40 text-xs tracking-[0.2em] mt-2 uppercase">
              {isActive ? 'Meditating' : 'Ready'}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {!isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-wrap justify-center gap-2 max-w-lg"
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
                className="w-16 h-16 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 flex items-center justify-center hover:bg-fuchsia-500/30 transition-all shadow-[0_0_20px_rgba(217,70,239,0.2)]"
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
