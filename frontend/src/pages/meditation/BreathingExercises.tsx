import { useState } from 'react';
import { Wind, Heart, Activity } from 'lucide-react';
import BreathingAnimation from '../../components/meditation/BreathingAnimation';
import JournalModal from '../../components/meditation/JournalModal';
import { useAuth } from '../../context/AuthContext';
import { logSession } from '../../api/meditation';

export default function BreathingExercises() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState<'Box' | '4-7-8' | 'Deep'>('Box');
  const [isActive, setIsActive] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const modes = [
    { 
      id: 'Box', 
      title: 'Box Breathing', 
      icon: Activity,
      desc: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Great for stress relief and immediate focus.',
      color: 'text-blue-400'
    },
    { 
      id: '4-7-8', 
      title: '4-7-8 Breathing', 
      icon: Wind,
      desc: 'Inhale 4s, Hold 7s, Exhale 8s. Natural tranquilizer for the nervous system.',
      color: 'text-indigo-400'
    },
    { 
      id: 'Deep', 
      title: 'Deep Belly', 
      icon: Heart,
      desc: 'Inhale 5s, Exhale 5s. Slow, deep breaths to activate the parasympathetic system.',
      color: 'text-emerald-400'
    }
  ];

  const handleToggle = () => {
    if (isActive) {
      // Stopping
      setIsActive(false);
      if (startTime) {
        setShowJournal(true);
      }
    } else {
      // Starting
      setIsActive(true);
      setStartTime(new Date());
    }
  };

  const handleSaveJournal = async (journalData: any) => {
    if (!user?.token || !startTime) return;

    const endTime = new Date();
    const durationMinutes = Math.max(1, Math.round((endTime.getTime() - startTime.getTime()) / 60000));

    try {
      await logSession({
        type: 'Breathing',
        durationMinutes,
        ...journalData
      }, user.token);
      setShowJournal(false);
      setStartTime(null);
    } catch (error) {
      console.error('Failed to log breathing session', error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Breathing Exercises</h1>
        <p className="text-white/60">Find your rhythm and calm your nervous system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => !isActive && setActiveMode(mode.id as any)}
              disabled={isActive}
              className={`p-6 rounded-2xl border text-left transition-all ${
                activeMode === mode.id
                  ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  : 'border-white/5 bg-black/20 hover:border-white/20'
              } ${isActive && activeMode !== mode.id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className={`h-8 w-8 mb-4 ${mode.color}`} />
              <h3 className="text-lg font-bold text-white mb-2">{mode.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{mode.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="glass rounded-3xl border border-indigo-500/30 p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <BreathingAnimation mode={activeMode} isActive={isActive} />

          <button
            onClick={handleToggle}
            className={`mt-12 px-12 py-4 rounded-full font-bold text-lg tracking-wider transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] ${
              isActive 
                ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                : 'bg-indigo-500 text-white hover:bg-indigo-400 hover:scale-105'
            }`}
          >
            {isActive ? 'FINISH' : 'START BREATHING'}
          </button>
        </div>
      </div>

      <JournalModal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        onSave={handleSaveJournal}
      />
    </div>
  );
}
