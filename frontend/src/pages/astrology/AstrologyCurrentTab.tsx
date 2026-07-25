import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCurrentDaysHoroscope } from '../../api/astrology';
import { getDailyPrediction } from '../../utils/astrologyDaily';
import { Clock, ShieldCheck, Sparkles, AlertTriangle, Trophy, CalendarDays } from 'lucide-react';

const AstrologyCurrentTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'yesterday' | 'today' | 'tomorrow'>('today');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const profileId = new URLSearchParams(location.search).get('profileId') || undefined;
        const result = await getCurrentDaysHoroscope(user.token, profileId);
        setData(result);
      } catch (error: any) {
        if (error.response?.status === 404) {
          navigate('/astrology/register');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate, location.search]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  const { transits, birthChart } = data;
  const natalMoon = birthChart.moonSign;

  const natalNakshatra = birthChart.moonNakshatra;

  const daysData = {
    yesterday: { title: 'நேற்று', subtitle: 'Yesterday', pred: getDailyPrediction(natalMoon, transits.yesterday.moonSign, natalNakshatra, transits.yesterday.moonNakshatra), color: 'slate' },
    today: { title: 'இன்று', subtitle: 'Today', pred: getDailyPrediction(natalMoon, transits.today.moonSign, natalNakshatra, transits.today.moonNakshatra), color: 'fuchsia' },
    tomorrow: { title: 'நாளை', subtitle: 'Tomorrow', pred: getDailyPrediction(natalMoon, transits.tomorrow.moonSign, natalNakshatra, transits.tomorrow.moonNakshatra), color: 'emerald' },
  };

  const activeDay = daysData[activeTab];

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8 pb-12 max-w-4xl mx-auto px-4 md:px-0">
      <div className="glass rounded-2xl md:rounded-3xl p-5 md:p-8 border border-fuchsia-500/20 bg-gradient-to-br from-slate-900 to-fuchsia-950/20 shadow-[0_0_25px_rgba(217,70,239,0.1)] text-center">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
          <Clock className="w-6 h-6 md:w-8 md:h-8 text-fuchsia-400" />
          <h1 className="text-2xl md:text-4xl font-black text-white">தற்போதைய நாட்கள்</h1>
        </div>
        <p className="text-fuchsia-200/70 text-sm md:text-lg px-2">
          உங்கள் தனிப்பட்ட ஜாதகப் பலன்கள். உங்களை தயார்படுத்திக் கொள்ளுங்கள்!
        </p>

        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-2 mt-6 md:mt-8 bg-slate-900/50 p-1.5 md:p-1 rounded-2xl w-fit mx-auto border border-white/5">
          {(['yesterday', 'today', 'tomorrow'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="text-sm md:text-base">{daysData[tab].title}</div>
              <div className="text-[10px] md:text-xs opacity-70 font-normal">{daysData[tab].subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={`glass p-5 md:p-8 rounded-2xl md:rounded-3xl border ${activeDay.color === 'fuchsia' ? 'border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.15)]' : 'border-slate-700/50'} flex flex-col transform transition-all duration-500 animate-in slide-in-from-bottom-4`}>
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6 md:mb-8 pb-4 md:pb-6 border-b ${activeDay.color === 'fuchsia' ? 'border-fuchsia-500/30' : 'border-white/10'}`}>
          <h2 className={`text-2xl md:text-3xl font-bold ${activeDay.color === 'fuchsia' ? 'text-fuchsia-400' : activeDay.color === 'emerald' ? 'text-emerald-400' : 'text-slate-300'} flex items-center gap-2 md:gap-3`}>
            <CalendarDays className="w-6 h-6 md:w-8 md:h-8" /> {activeDay.title}
          </h2>
          {activeDay.pred.status === 'Chandrashtamam' && (
            <span className="bg-red-950/50 text-red-400 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-red-500/50 animate-pulse font-bold flex items-center gap-2 text-sm md:text-base">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              சந்திராஷ்டமம்
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-slate-900/50 p-5 md:p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors">
            <h3 className="text-blue-300 font-bold mb-2 md:mb-3 flex items-center gap-2 text-base md:text-lg">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-400" /> நாளின் தன்மை (Setup)
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-lg">{activeDay.pred.prediction}</p>
          </div>

          <div className="bg-emerald-950/20 p-5 md:p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <h3 className="text-emerald-400 font-bold mb-2 md:mb-3 flex items-center gap-2 text-base md:text-lg">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" /> எப்படி கையாள்வது? (Handle)
            </h3>
            <p className="text-emerald-200/80 leading-relaxed text-sm md:text-lg">{activeDay.pred.remedy}</p>
          </div>

          <div className="bg-yellow-950/20 p-5 md:p-6 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
            <h3 className="text-yellow-400 font-bold mb-2 md:mb-3 flex items-center gap-2 text-base md:text-lg">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" /> வெற்றி பெறுவது எப்படி? (Win)
            </h3>
            <p className="text-yellow-200/80 leading-relaxed text-sm md:text-lg">{activeDay.pred.winTheDay}</p>
          </div>

          <div className="bg-orange-950/20 p-5 md:p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <h3 className="text-orange-400 font-bold mb-2 md:mb-3 flex items-center gap-2 text-base md:text-lg">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-orange-400" /> கவனம் தேவை (Caution)
            </h3>
            <p className="text-orange-200/80 leading-relaxed text-sm md:text-lg">{activeDay.pred.caution}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologyCurrentTab;

