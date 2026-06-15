import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Zap, Activity } from 'lucide-react';

interface YogaExperienceModalProps {
  isOpen: boolean;
  onSelect: (level: string) => void;
}

export default function YogaExperienceModal({ isOpen, onSelect }: YogaExperienceModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelect = async (level: string) => {
    setLoading(true);
    await onSelect(level);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Leaf className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Welcome to Yoga Coach</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            To personalize your daily plan and library recommendations, please select your current yoga experience level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Beginner */}
          <button
            disabled={loading}
            onClick={() => handleSelect('Beginner')}
            className="group relative p-6 bg-slate-800/50 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/50 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <Activity className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Beginner</h3>
            <p className="text-sm text-slate-400">
              New to yoga. Focus on basic poses, breathing, and building a foundation.
            </p>
          </button>

          {/* Intermediate */}
          <button
            disabled={loading}
            onClick={() => handleSelect('Intermediate')}
            className="group relative p-6 bg-slate-800/50 hover:bg-blue-500/10 border border-slate-700 hover:border-blue-500/50 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <Zap className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Intermediate</h3>
            <p className="text-sm text-slate-400">
              Familiar with common poses. Ready for longer flows and deeper stretches.
            </p>
          </button>

          {/* Advanced */}
          <button
            disabled={loading}
            onClick={() => handleSelect('Advanced')}
            className="group relative p-6 bg-slate-800/50 hover:bg-purple-500/10 border border-slate-700 hover:border-purple-500/50 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <Award className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Advanced</h3>
            <p className="text-sm text-slate-400">
              Strong practice foundation. Ready for complex inversions and intense flows.
            </p>
          </button>
        </div>
        
        {loading && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
