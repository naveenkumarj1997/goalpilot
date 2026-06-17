
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Sparkles, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LockedModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  status: 'Premium' | 'Disabled';
}

export default function LockedModuleModal({ isOpen, onClose, moduleName, status }: LockedModuleModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getModuleDescription = (name: string) => {
    switch (name) {
      case 'Gaming Lounge':
        return 'Take a break, relax, and play exciting mini-games with your friends and other users.';
      case 'Resume Builder':
        return 'Craft professional, ATS-friendly resumes tailored to your next big career opportunity.';
      case 'Job Tracker':
        return 'Organize your job search, track applications, and manage interviews all in one place.';
      case 'Home Coach':
        return 'Get personalized home workout routines to stay fit without hitting the gym.';
      case 'Yoga Coach':
        return 'Access guided yoga sessions to improve flexibility, strength, and mindfulness.';
      case 'Meditation':
        return 'Find your inner peace with guided meditations, breathing exercises, and focus timers.';
      case 'Stoicism':
        return 'Learn timeless stoic wisdom to build resilience and master your mindset.';
      case 'Personal Dev':
        return 'Upgrade your soft skills, confidence, body language, and communication abilities.';
      case 'Manifestation':
        return 'Build your dream life with vision boards, affirmations, and success journals.';
      default:
        return 'Unlock this exclusive feature to supercharge your GoalPilot experience and achieve more.';
    }
  };

  const handleUpgrade = () => {
    onClose();
    navigate('/upgrade', { state: { moduleName } });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-emerald-500/20 w-full max-w-md mx-auto z-10 overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 text-center relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg relative">
              {status === 'Premium' ? (
                <>
                  <div className="absolute inset-0 rounded-full border border-yellow-500/30 animate-ping opacity-20"></div>
                  <Lock className="w-8 h-8 text-yellow-500" />
                </>
              ) : (
                <AlertTriangle className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {status === 'Premium' ? 'Premium Feature' : 'Module Disabled'}
            </h3>
            <p className="text-emerald-400 font-medium mb-4">
              {moduleName}
            </p>
            
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              {status === 'Premium' 
                ? getModuleDescription(moduleName)
                : 'This module is currently down for maintenance or has been disabled by the administrator. Please check back later.'}
            </p>

            {status === 'Premium' && (
              <div className="space-y-4">
                <button
                  onClick={handleUpgrade}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-brand hover:from-emerald-400 hover:to-brand-hover text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-transparent hover:bg-slate-800 text-slate-300 font-medium rounded-xl transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            )}
            
            {status === 'Disabled' && (
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
              >
                Understood
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
