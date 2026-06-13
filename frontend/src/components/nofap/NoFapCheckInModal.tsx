import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Check, XCircle } from 'lucide-react';
import { dailyCheckIn } from '../../api/nofap';

interface NoFapCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NoFapCheckInModal({ isOpen, onClose, onSuccess }: NoFapCheckInModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckIn = async (success: boolean) => {
    setLoading(true);
    setError('');
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (!token) throw new Error('No token found');
      
      await dailyCheckIn(success, token);
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to log check-in. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-gray-900 border border-brand/30 shadow-[0_0_40px_rgba(0,112,209,0.2)] rounded-2xl p-6 overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center relative z-10 pt-4">
              <div className="h-16 w-16 bg-gradient-to-br from-brand to-emerald-500 rounded-2xl p-0.5 mb-6 shadow-lg rotate-3">
                <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center -rotate-3">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Daily Check-In</h2>
              <p className="text-gray-400 mb-8">
                Did you successfully complete your NoFap goal today?
              </p>

              {error && (
                <div className="w-full mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex w-full space-x-4">
                <button
                  onClick={() => handleCheckIn(true)}
                  disabled={loading}
                  className="flex-1 group relative flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-900 transition-all disabled:opacity-50 overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <Check className="h-5 w-5 mr-2" />
                  YES
                </button>
                <button
                  onClick={() => handleCheckIn(false)}
                  disabled={loading}
                  className="flex-1 group relative flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-all disabled:opacity-50 overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <XCircle className="h-5 w-5 mr-2" />
                  NO
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
