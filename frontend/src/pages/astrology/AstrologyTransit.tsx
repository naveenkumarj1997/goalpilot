import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTransitInterpretations } from '../../api/astrology';
import { Globe, AlertCircle, CheckCircle2, Circle } from 'lucide-react';

const rasiTamilMap: Record<number, string> = {
  1: 'மேஷம்',
  2: 'ரிஷபம்',
  3: 'மிதுனம்',
  4: 'கடகம்',
  5: 'சிம்மம்',
  6: 'கன்னி',
  7: 'துலாம்',
  8: 'விருச்சிகம்',
  9: 'தனுசு',
  10: 'மகரம்',
  11: 'கும்பம்',
  12: 'மீனம்'
};

const AstrologyTransit = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const profileId = new URLSearchParams(location.search).get('profileId') || undefined;
        const result = await getTransitInterpretations(user.token, profileId);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch transit details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  const { moonSign, interpretations } = data;
  const tamilRasi = rasiTamilMap[moonSign] || moonSign;

  return (
    <div className="animate-fade-in space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="glass rounded-3xl p-8 border border-fuchsia-500/20 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-slate-900 to-fuchsia-950/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-fuchsia-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white">கோச்சாரம் (Transit)</h1>
          </div>
          <p className="text-fuchsia-200/70 text-lg">
            உங்கள் ஜென்ம ராசி <strong className="text-fuchsia-300 font-bold">{tamilRasi}</strong> அடிப்படையில் தற்போதைய கிரக சஞ்சார பலன்கள்
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {interpretations.map((item: any, idx: number) => {
          let statusColor = 'text-slate-400';
          let bgColor = 'bg-slate-800/40 border-slate-700/50';
          let StatusIcon = Circle;

          if (item.status === 'Good') {
            statusColor = 'text-emerald-400';
            bgColor = 'bg-emerald-900/10 border-emerald-500/30';
            StatusIcon = CheckCircle2;
          } else if (item.status === 'Bad') {
            statusColor = 'text-rose-400';
            bgColor = 'bg-rose-900/10 border-rose-500/30';
            StatusIcon = AlertCircle;
          } else if (item.status === 'Neutral') {
            statusColor = 'text-yellow-400';
            bgColor = 'bg-yellow-900/10 border-yellow-500/30';
            StatusIcon = Circle; // Could use another icon
          }

          return (
            <div key={idx} className={`glass p-6 rounded-2xl border ${bgColor} transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center`}>
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className={`p-3 rounded-full bg-slate-950/50`}>
                  <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.planet}</h3>
                  <p className="text-sm text-slate-400">{item.houseFromMoon}-ம் இடம்</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-slate-300 text-lg leading-relaxed">{item.interpretation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AstrologyTransit;
