import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTodayHoroscope } from '../../api/astrology';
import { useSearchParams } from 'react-router-dom';
import { getPlanetPredictions, type PlanetPrediction } from '../../utils/astrologyPlanets';
import { AlertCircle, CheckCircle2, Info, Star } from 'lucide-react';

const AstrologyPlanetsTab = () => {
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

  const { birthChart, analysis } = data;
  const planetPredictions = getPlanetPredictions(birthChart.planets, birthChart.ascendant.sign, analysis);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      <div className="glass p-5 md:p-8 rounded-2xl border border-fuchsia-500/20">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 flex items-center gap-3">
          <Star className="w-6 h-6 md:w-8 md:h-8 text-fuchsia-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400">
            நவகிரகங்களின் பலன்கள்
          </span>
        </h2>
        <p className="text-slate-300 text-base md:text-lg">
          உங்கள் ஜாதக அமைப்பின்படி நவகிரகங்கள் எந்தெந்த வீடுகளில் அமர்ந்துள்ளன என்பதையும், அவை உங்களுக்கு வழங்கும் தனிப்பட்ட பலன்களையும் இங்கே காணலாம்.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {planetPredictions.map((planet: PlanetPrediction, idx: number) => {
          
          let cardBorder = 'border-slate-700/50 hover:border-yellow-500/50';
          let headerColor = 'text-yellow-300';
          let StatusIcon = Info;
          let statusText = 'நடுத்தரம் (Neutral)';

          if (planet.status === 'Good') {
            cardBorder = 'border-emerald-500/30 hover:border-emerald-400/80';
            headerColor = 'text-emerald-400';
            StatusIcon = CheckCircle2;
            statusText = 'நன்மை (Benefic)';
          } else if (planet.status === 'Caution') {
            cardBorder = 'border-red-500/30 hover:border-red-400/80';
            headerColor = 'text-red-400';
            StatusIcon = AlertCircle;
            statusText = 'கவனம் தேவை (Malefic)';
          }

          return (
            <div key={idx} className={`glass p-5 md:p-6 rounded-2xl border ${cardBorder} transition-all duration-300 flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950/80`}>
              
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <h3 className={`text-xl md:text-2xl font-black flex items-center gap-2 ${headerColor}`}>
                  {planet.tamilName}
                </h3>
                <div className={`flex flex-col items-end text-[10px] md:text-xs font-bold ${planet.iconColor}`}>
                  <StatusIcon className="w-4 h-4 md:w-5 md:h-5 mb-1" />
                  {statusText}
                </div>
              </div>

              <div className="flex-1 mb-5 md:mb-6">
                <p className="text-slate-200 leading-relaxed text-[14px] md:text-[15px]">
                  {planet.prediction}
                </p>
              </div>

              {planet.remedy && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 md:p-4 mt-auto">
                  <h4 className="text-red-300 font-bold mb-2 text-xs md:text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4" /> பரிகாரம் (Remedy)
                  </h4>
                  <p className="text-slate-300 text-xs md:text-sm mb-2">{planet.remedy}</p>
                  {planet.temple && (
                    <p className="text-yellow-400/90 text-xs md:text-sm font-semibold">
                      <span className="text-slate-400 font-normal">திருக்கோவில்: </span> 
                      {planet.temple}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AstrologyPlanetsTab;
