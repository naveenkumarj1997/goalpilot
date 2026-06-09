import { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Clock, Save } from 'lucide-react';

export default function Settings() {
  const { updateUser } = useAuth();
  const [dailyCheckInTime, setDailyCheckInTime] = useState('20:00');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.dailyCheckInTime) {
        setDailyCheckInTime(user.dailyCheckInTime);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updatedUser = await authService.updateSettings({ dailyCheckInTime });
      if (updatedUser) {
        updateUser(updatedUser);
      }
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border border-emerald-100 rounded-2xl shadow-sm overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-full mix-blend-multiply opacity-50 blur-2xl -z-10" />
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Daily Check-In</h2>
            <p className="text-sm text-text-secondary mb-4">
              Choose the time of day you would like GoalPilot to ask you to log your hours. The prompt will only appear if you are logged in past this time.
            </p>
            
            <div className="max-w-xs">
              <label htmlFor="dailyCheckInTime" className="block text-sm font-medium text-text-primary mb-1">
                Check-In Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-emerald-500" />
                </div>
                <input
                  type="time"
                  id="dailyCheckInTime"
                  value={dailyCheckInTime}
                  onChange={(e) => setDailyCheckInTime(e.target.value)}
                  className="w-full pl-10 px-4 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-shadow bg-white/50"
                  required
                />
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-emerald-100/50">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 btn-primary rounded-xl font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
