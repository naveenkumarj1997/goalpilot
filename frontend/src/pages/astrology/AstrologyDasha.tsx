import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashaPeriods } from '../../api/astrology';
import { Calendar, Clock, Star } from 'lucide-react';

const lordTamilNames: Record<string, string> = {
  Ketu: 'கேது',
  Venus: 'சுக்கிரன்',
  Sun: 'சூரியன்',
  Moon: 'சந்திரன்',
  Mars: 'செவ்வாய்',
  Rahu: 'ராகு',
  Jupiter: 'குரு (வியாழன்)',
  Saturn: 'சனி',
  Mercury: 'புதன்'
};

const AstrologyDasha = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState<any[]>([]);

  useEffect(() => {
    const fetchDasha = async () => {
      try {
        if (!user?.token) return;
        const data = await getDashaPeriods(user.token);
        setPeriods(data);
      } catch (error) {
        console.error("Failed to fetch Dasha periods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDasha();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  const now = new Date();
  const currentPeriod = periods.find(p => new Date(p.startDate) <= now && new Date(p.endDate) >= now);

  return (
    <div className="animate-fade-in space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="glass rounded-3xl p-8 border border-fuchsia-500/20 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-slate-900 to-fuchsia-950/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-fuchsia-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white">தசா புக்தி</h1>
          </div>
          <p className="text-fuchsia-200/70 text-lg">உங்கள் வாழ்வில் நடக்கும் முக்கிய தசா காலங்கள்</p>
        </div>
      </div>

      {currentPeriod && (
        <div className="glass p-8 rounded-3xl border border-fuchsia-500/50 bg-fuchsia-900/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            தற்போது நடக்கும் தசா
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-4xl font-black text-fuchsia-300 mb-2">{lordTamilNames[currentPeriod.lord] || currentPeriod.lord} தசா</p>
              <p className="text-slate-400">
                {new Date(currentPeriod.startDate).toLocaleDateString('ta-IN')} முதல் {new Date(currentPeriod.endDate).toLocaleDateString('ta-IN')} வரை
              </p>
            </div>
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.5)]">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      )}

      <div className="glass p-8 rounded-3xl border border-slate-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">விம்சொத்தரி தசா (120 ஆண்டுகள்)</h2>
        
        <div className="relative">
          {/* Vertical line connecting events */}
          <div className="absolute left-[20px] top-4 bottom-4 w-1 bg-slate-700/50 rounded-full"></div>
          
          <div className="space-y-6 relative">
            {periods.map((period, index) => {
              const isCurrent = currentPeriod && currentPeriod.lord === period.lord;
              const isPast = new Date(period.endDate) < now;
              
              return (
                <div key={index} className={`flex items-start gap-6 transition-all ${isPast ? 'opacity-50' : 'opacity-100'}`}>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center z-10 shrink-0 ${isCurrent ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    <Star className="w-5 h-5" />
                  </div>
                  <div className={`flex-1 glass p-5 rounded-2xl border ${isCurrent ? 'border-fuchsia-500/50 bg-fuchsia-900/10' : 'border-slate-700/50 hover:bg-slate-800/40'} transition-colors`}>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-xl font-bold ${isCurrent ? 'text-fuchsia-300' : 'text-white'}`}>
                        {lordTamilNames[period.lord] || period.lord} தசா
                      </h3>
                      {isCurrent && <span className="bg-fuchsia-500/20 text-fuchsia-300 text-xs px-2 py-1 rounded border border-fuchsia-500/30 font-bold uppercase">நடப்பு</span>}
                    </div>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(period.startDate).toLocaleDateString('ta-IN')} - {new Date(period.endDate).toLocaleDateString('ta-IN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologyDasha;
