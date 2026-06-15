import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Focus, Moon, Heart, Target } from 'lucide-react';

interface MeditationExperienceModalProps {
  isOpen: boolean;
  onSave: (data: { experienceLevel: string; primaryGoal: string }) => void;
}

export default function MeditationExperienceModal({ isOpen, onSave }: MeditationExperienceModalProps) {
  const [step, setStep] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && experienceLevel) setStep(2);
    else if (step === 2 && primaryGoal) {
      onSave({ experienceLevel, primaryGoal });
    }
  };

  const goals = [
    { id: 'Better Focus', icon: Target, label: 'Better Focus', desc: 'Improve concentration' },
    { id: 'Better Sleep', icon: Moon, label: 'Better Sleep', desc: 'Rest peacefully' },
    { id: 'Stress Relief', icon: Wind, label: 'Stress Relief', desc: 'Reduce tension' },
    { id: 'Anxiety Management', icon: Focus, label: 'Anxiety Management', desc: 'Calm your mind' },
    { id: 'General Wellness', icon: Heart, label: 'General Wellness', desc: 'Overall health' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-lg rounded-2xl border border-indigo-500/30 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: '50%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-indigo-500/30">
              <Wind className="h-8 w-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {step === 1 ? 'Welcome to Meditation' : 'What brings you here?'}
            </h2>
            <p className="text-indigo-200/70">
              {step === 1 
                ? 'Let\'s personalize your mindfulness journey.' 
                : 'Select your primary goal to get tailored recommendations.'}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setExperienceLevel(level)}
                  className={`w-full p-4 rounded-xl border transition-all text-left flex justify-between items-center ${
                    experienceLevel === level 
                      ? 'border-indigo-400 bg-indigo-500/20 text-white' 
                      : 'border-white/10 text-white/70 hover:border-indigo-500/50 hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium">{level}</span>
                  {level === 'Beginner' && <span className="text-xs px-2 py-1 bg-white/10 rounded-md">New to this</span>}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {goals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setPrimaryGoal(goal.id)}
                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                      primaryGoal === goal.id 
                        ? 'border-indigo-400 bg-indigo-500/20 text-white' 
                        : 'border-white/10 text-white/70 hover:border-indigo-500/50 hover:bg-white/5'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${primaryGoal === goal.id ? 'bg-indigo-500/30' : 'bg-white/5'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-xs text-white/50">{goal.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={step === 1 ? !experienceLevel : !primaryGoal}
              className="flex-1 bg-indigo-500 text-white font-medium py-3 rounded-xl hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              {step === 1 ? 'Continue' : 'Complete Setup'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
