import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createRoom } from '../../api/watchTogether';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, Lock, Globe, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Public',
    maxUsers: 10,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }
    if (formData.type === 'Private' && !formData.password) {
      setError('Password is required for Private rooms');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (user?.token) {
        const room = await createRoom(user.token, formData);
        navigate(`/watch/room/${room._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/watch')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <MonitorPlay className="w-8 h-8 text-brand" />
          Create Watch Room
        </h1>
        <p className="text-slate-400 mb-8 text-sm md:text-base">Set up a room to start streaming to your friends.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Room Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Anime Night 🍿"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
              maxLength={40}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Room Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Public'})}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    formData.type === 'Public' 
                      ? 'bg-brand/20 border-brand text-white shadow-[0_0_15px_rgba(0,112,209,0.3)]' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <Globe className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Private'})}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    formData.type === 'Private' 
                      ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <Lock className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">Private</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Max Viewers</label>
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex items-center justify-between">
                <Users className="w-5 h-5 text-slate-400" />
                <input 
                  type="number" 
                  min="2" 
                  max="50"
                  value={formData.maxUsers}
                  onChange={e => setFormData({...formData, maxUsers: parseInt(e.target.value) || 10})}
                  className="bg-transparent text-white text-right font-bold focus:outline-none w-16"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">To ensure smooth streaming, limit is 50 users.</p>
            </div>
          </div>

          {formData.type === 'Private' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Room Password</label>
              <input 
                type="text" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="Secret key..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </motion.div>
          )}

          <div className="pt-6 border-t border-slate-700/50">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-white py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,112,209,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>Create & Enter Room <MonitorPlay className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
