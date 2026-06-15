import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, EyeOff, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { completeExercise } from '../../api/stoicism';

const EXERCISES = [
  {
    id: 'negative_visualization',
    title: 'Negative Visualization',
    icon: EyeOff,
    color: 'text-purple-400',
    description: 'Premeditatio Malorum: Imagine losing something you value to increase your gratitude for it right now.',
    steps: [
      'Close your eyes and think of something you value highly (a person, your health, your job).',
      'Imagine, in detail, what your life would be like if you suddenly lost it today.',
      'Allow yourself to briefly feel the discomfort of that loss.',
      'Open your eyes and look at that thing/person with immense gratitude that you still have it.'
    ],
    duration: '3 Minutes'
  },
  {
    id: 'amor_fati',
    title: 'Amor Fati Practice',
    icon: Heart,
    color: 'text-rose-400',
    description: 'Love your fate: Practice reframing a current negative situation into a positive necessity.',
    steps: [
      'Identify a current annoying or frustrating situation in your life.',
      'Acknowledge that complaining about it changes nothing.',
      'Write down 3 ways this exact situation is actually forcing you to grow or become stronger.',
      'Say to yourself: "I do not just accept this, I embrace it."'
    ],
    duration: '5 Minutes'
  },
  {
    id: 'control_audit',
    title: 'The Dichotomy of Control',
    icon: Shield,
    color: 'text-blue-400',
    description: 'A mental audit to separate what you control from what you don\'t.',
    steps: [
      'Take a piece of paper and draw a line down the middle.',
      'On the left side, list everything stressing you out that you CANNOT control (other people, the past, the weather).',
      'On the right side, list everything you CAN control (your effort, your reaction, your attitude).',
      'Physically cross out the left side and commit to only focusing on the right side today.'
    ],
    duration: '5 Minutes'
  }
];

export default function StoicExercises() {
  const { user } = useAuth();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const handleComplete = async (id: string) => {
    if (!user?.token) return;
    try {
      await completeExercise(user.token);
      setCompleted([...completed, id]);
      setActiveExercise(null);
    } catch (error) {
      console.error('Failed to log exercise', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-white mb-4">
          Mental Training
        </h1>
        <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
          Stoicism is not just a philosophy to read, but a practice to perform. Train your mind with these ancient exercises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {EXERCISES.map((ex) => {
          const Icon = ex.icon;
          const isActive = activeExercise === ex.id;
          const isDone = completed.includes(ex.id);

          return (
            <motion.div
              key={ex.id}
              layout
              className={`glass rounded-3xl border overflow-hidden transition-all duration-500 ${
                isActive 
                  ? 'col-span-1 md:col-span-3 bg-[#1e293b] border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                  : isDone
                    ? 'border-emerald-500/30 bg-[#0f172a]/60 opacity-80'
                    : 'border-white/10 bg-[#0f172a]/80 hover:border-amber-500/30 hover:bg-[#1e293b]/50'
              }`}
            >
              {!isActive ? (
                <div 
                  className="p-8 h-full flex flex-col cursor-pointer"
                  onClick={() => !isDone && setActiveExercise(ex.id)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl bg-black/30 ${ex.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    {isDone && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-white mb-3">{ex.title}</h2>
                  <p className="text-blue-200/60 leading-relaxed mb-6 flex-1">
                    {ex.description}
                  </p>
                  <div className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                    {isDone ? 'Completed' : `Start • ${ex.duration}`}
                  </div>
                </div>
              ) : (
                <div className="p-8 md:p-12">
                  <button 
                    onClick={() => setActiveExercise(null)}
                    className="text-amber-400 hover:text-amber-300 text-sm font-medium mb-8"
                  >
                    ← Back to Exercises
                  </button>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-4 rounded-2xl bg-black/30 ${ex.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold font-serif text-white">{ex.title}</h2>
                      <p className="text-amber-400/80 font-medium">{ex.duration} Practice</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                    {ex.steps.map((step, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0 mt-1">
                          {idx + 1}
                        </div>
                        <p className="text-xl text-blue-50/90 leading-relaxed font-serif">
                          {step}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center border-t border-white/10 pt-8">
                    <button
                      onClick={() => handleComplete(ex.id)}
                      className="flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    >
                      <CheckCircle2 className="h-6 w-6 mr-3" />
                      I have completed this exercise
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
