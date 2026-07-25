import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTodayHoroscope } from '../../api/astrology';
import { useSearchParams } from 'react-router-dom';

const RasiGrid = ({ planets, analysis }: { planets: any[], analysis?: any }) => {
  const getPlanetsInSign = (sign: number) => {
    return planets.filter(p => p.sign === sign).map(p => {
      let suffix = '';
      if (p.isRetrograde) suffix = ' (வ)';
      
      let colorClass = 'text-white';
      if (p.originalName === 'Ascendant' || p.name === 'லக்னம்') {
        colorClass = 'text-fuchsia-400 font-bold';
      } else if (analysis?.benefics?.includes(p.originalName)) {
        colorClass = 'text-green-400';
      } else if (analysis?.malefics?.includes(p.originalName)) {
        colorClass = 'text-red-400';
      }

      return {
        label: p.name + suffix,
        colorClass
      };
    });
  };

  const RasiBox = ({ sign, title }: { sign: number, title?: string }) => {
    const pl = getPlanetsInSign(sign);
    return (
      <div className="border border-fuchsia-500/30 p-2 min-h-[100px] flex flex-col items-center justify-center bg-slate-900/50 hover:bg-fuchsia-900/20 transition-colors text-center text-sm md:text-base relative group">
        <div className="absolute top-1 left-1 text-[10px] text-fuchsia-500/50">{sign}</div>
        {title && <div className="text-fuchsia-300 font-bold mb-1">{title}</div>}
        {pl.map((p, i) => (
          <div key={i} className={p.colorClass}>{p.label}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-0 max-w-[600px] mx-auto border-2 border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
      {/* Top Row: Pisces (12), Aries (1), Taurus (2), Gemini (3) */}
      <RasiBox sign={12} title="மீனம்" />
      <RasiBox sign={1} title="மேஷம்" />
      <RasiBox sign={2} title="ரிஷபம்" />
      <RasiBox sign={3} title="மிதுனம்" />

      {/* Middle Rows */}
      <RasiBox sign={11} title="கும்பம்" />
      <div className="col-span-2 row-span-2 flex items-center justify-center bg-slate-950/80 p-4 border border-fuchsia-500/20">
        <div className="text-center">
          <h3 className="text-xl font-bold text-fuchsia-400 mb-2">ராசி சக்கரம்</h3>
          <p className="text-sm text-slate-400">South Indian Format</p>
        </div>
      </div>
      <RasiBox sign={4} title="கடகம்" />

      <RasiBox sign={10} title="மகரம்" />
      <RasiBox sign={5} title="சிம்மம்" />

      {/* Bottom Row: Sagittarius (9), Scorpio (8), Libra (7), Virgo (6) */}
      <RasiBox sign={9} title="தனுசு" />
      <RasiBox sign={8} title="விருச்சிகம்" />
      <RasiBox sign={7} title="துலாம்" />
      <RasiBox sign={6} title="கன்னி" />
    </div>
  );
};

const AstrologyChartTab = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('profileId') || undefined;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.token) {
          const res = await getTodayHoroscope(user.token, profileId);
          setData(res);
        }
      } catch (error) {
        console.error("Error fetching chart data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.token, profileId]);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full"></div></div>;
  }

  if (!data || !data.birthChart || !data.birthChart.planets) {
    return <div className="text-center text-slate-400 p-8">ஜாதக விவரங்கள் கிடைக்கவில்லை. (Chart data not available)</div>;
  }

  // Map English planet names to Tamil
  const planetTamilMap: Record<string, string> = {
    'Sun': 'சூரியன்',
    'Moon': 'சந்திரன்',
    'Mars': 'செவ்வாய்',
    'Mercury': 'புதன்',
    'Jupiter': 'குரு',
    'Venus': 'சுக்கிரன்',
    'Saturn': 'சனி',
    'Rahu': 'ராகு',
    'Ketu': 'கேது',
    'Ascendant': 'லக்னம்'
  };

  const localizedPlanets = [...data.birthChart.planets, data.birthChart.ascendant].map((p: any) => ({
    ...p,
    originalName: p.name,
    name: planetTamilMap[p.name] || p.name
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass p-6 md:p-8 rounded-2xl border border-fuchsia-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400">
            ஜனன கால ராசி சக்கரம்
          </span>
        </h2>
        <div className="overflow-x-auto pb-4">
          <RasiGrid planets={localizedPlanets} analysis={data.analysis} />
        </div>
      </div>
      <div className="glass p-6 md:p-8 rounded-2xl border border-fuchsia-500/20 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400">
            ஜாதக பலன்கள் (Chart Analysis)
          </span>
        </h2>
        
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-fuchsia-500/10">
            <h3 className="text-lg font-bold text-fuchsia-300 mb-2">சுப கிரகங்கள் (Good Planets)</h3>
            <p className="text-slate-300">
              உங்கள் லக்னத்தின்படி நற்பலன்களைத் தரும் கிரகங்கள்: 
              <span className="font-semibold text-green-400 ml-2">
                {data.analysis?.benefics?.map((b: string) => planetTamilMap[b] || b).join(', ') || 'இல்லை'}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-fuchsia-500/10">
            <h3 className="text-lg font-bold text-fuchsia-300 mb-2">அசுப கிரகங்கள் (Challenging Planets)</h3>
            <p className="text-slate-300">
              சவால்களைத் தரக்கூடிய கிரகங்கள் (பரிகாரம் தேவைப்படலாம்): 
              <span className="font-semibold text-red-400 ml-2">
                {data.analysis?.malefics?.map((m: string) => planetTamilMap[m] || m).join(', ') || 'இல்லை'}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-fuchsia-500/10">
            <h3 className="text-lg font-bold text-fuchsia-300 mb-2">முக்கிய யோகங்கள் (Yogas & Doshas)</h3>
            {data.analysis?.yogas?.length > 0 ? (
              <ul className="space-y-3">
                {data.analysis.yogas.map((yoga: any, i: number) => (
                  <li key={i} className="text-slate-300 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <strong className="text-purple-300">{yoga.name}:</strong> {yoga.result}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">குறிப்பிடத்தக்க முக்கிய யோகங்கள் ஏதுமில்லை.</p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-fuchsia-500/10">
            <h3 className="text-lg font-bold text-fuchsia-300 mb-2">குறிப்பு (Notes)</h3>
            <p className="text-slate-300">
              <strong>(வ) - வக்ரம் (Retrograde):</strong> சக்கரத்தில் ஒரு கிரகத்தின் அருகில் '(வ)' என்று இருந்தால், அது பூமியிலிருந்து பார்க்கும்போது பின்னோக்கி நகர்வது போல் தோன்றும் 'வக்ர' நிலையில் உள்ளது என்று பொருள். வக்ரமடைந்த கிரகங்கள் வழக்கத்திற்கு மாறான பலன்களைத் தரக்கூடும்.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologyChartTab;
