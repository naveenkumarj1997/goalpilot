import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTodayHoroscope } from '../../api/astrology';
import { Moon, Sparkles, Star, Compass, Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import SouthIndianChart from './components/SouthIndianChart';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AstrologyPDF from './AstrologyPDF';
import { getDailyPrediction } from '../../utils/astrologyDaily';

const signsTamil = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்',
  'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்',
  'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
];

const AstrologyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const profileId = new URLSearchParams(location.search).get('profileId') || undefined;
        const result = await getTodayHoroscope(user.token, profileId);
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
  }, [user, navigate]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  const { profile, currentTransit, birthChart } = data;
  const moonSignName = signsTamil[birthChart.moonSign - 1];
  const todayMoonSignName = signsTamil[currentTransit.moonSign - 1];
  
  const dailyPred = getDailyPrediction(birthChart.moonSign, currentTransit.moonSign);

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <div className="glass rounded-3xl p-8 border border-fuchsia-500/20 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-slate-900 to-fuchsia-950/20 shadow-[0_0_25px_rgba(217,70,239,0.1)]">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-8 h-8 text-fuchsia-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white">இன்றைய பலன்</h1>
          </div>
          <p className="text-fuchsia-200/70 text-lg mb-4">வணக்கம் {profile.name}, இன்றைய நாள் எப்படி இருக்கும்?</p>
          
          <PDFDownloadLink 
            document={<AstrologyPDF profile={profile} chartData={birthChart} />} 
            fileName="Jathagam_GoalPilot.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-medium transition-colors"
          >
            {({ loading }) => (
              <>
                <Download className="w-4 h-4" />
                {loading ? 'தயாராகிறது...' : 'ஜாதகம் PDF பதிவிறக்கு'}
              </>
            )}
          </PDFDownloadLink>
        </div>
        <div className="mt-6 md:mt-0 p-4 glass rounded-2xl border border-fuchsia-500/30 text-center flex flex-col items-center min-w-[150px] shadow-[inset_0_0_15px_rgba(217,70,239,0.1)]">
          <Star className="w-6 h-6 text-yellow-400 mb-1 fill-current" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">உங்கள் ராசி</p>
          <p className="text-xl font-bold text-white text-shadow-glow-fuchsia">{moonSignName}</p>
        </div>
      </div>

      {dailyPred.status === 'Chandrashtamam' && (
        <div className="bg-red-950/40 border-l-4 border-red-500 p-6 rounded-2xl animate-pulse-slow flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-bold text-xl mb-1">சந்திராஷ்டமம் எச்சரிக்கை!</h3>
            <p className="text-red-200/80">இன்று உங்களுக்கு சந்திராஷ்டமம். புதிய முயற்சிகளை தவிர்த்து, அமைதியாக இருப்பது மிகவும் நல்லது.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-fuchsia-500/50 transition-colors flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Compass className="w-5 h-5 text-fuchsia-400" />
            இன்றைய சந்திரன்
          </h3>
          <p className="text-3xl font-black text-fuchsia-300">{todayMoonSignName}</p>
          <p className="text-sm text-slate-400 mt-2">கோச்சாரம் (Transit)</p>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-colors flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            அதிர்ஷ்ட நிறம்
          </h3>
          <p className="text-3xl font-black text-emerald-300">{dailyPred.luckyColor}</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-yellow-500/50 transition-colors flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            அதிர்ஷ்ட எண்
          </h3>
          <p className="text-3xl font-black text-yellow-300">{dailyPred.luckyNumber}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-slate-700/50 shadow-lg flex flex-col h-full">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">இன்றைய பொது பலன்</h2>
          
          <div className="space-y-6 flex-1">
            <div>
              <h3 className="text-fuchsia-300 font-bold mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-fuchsia-400" /> நாளின் தன்மை
              </h3>
              <p className="text-slate-300 leading-relaxed">{dailyPred.prediction}</p>
            </div>
            
            <div className="bg-orange-950/20 p-4 rounded-xl border border-orange-500/20">
              <h3 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> கவனம் தேவை
              </h3>
              <p className="text-orange-200/80">{dailyPred.caution}</p>
            </div>

            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/20">
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> பரிகாரம் / எளிய தீர்வு
              </h3>
              <p className="text-emerald-200/80">{dailyPred.remedy}</p>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-slate-700/50 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">இன்றைய கிரக நிலை (கோச்சாரம்)</h2>
          <div className="flex justify-center">
            <SouthIndianChart 
              planets={currentTransit.planets} 
              ascendantSign={currentTransit.ascendant.sign}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologyDashboard;
