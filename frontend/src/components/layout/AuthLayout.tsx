import { Outlet } from 'react-router-dom';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/login_bg.png")' }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="rounded-2xl bg-brand p-3 shadow-lg shadow-brand/20">
            <Target className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-center text-3xl font-extrabold text-text-primary tracking-tight"
        >
          GoalPilot
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-sm text-text-secondary"
        >
          Navigate your ambitions with clarity and calm.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-bg-surface py-8 px-4 shadow-xl shadow-brand-light/10 sm:rounded-3xl sm:px-10 border border-gray-100">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
