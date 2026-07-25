import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAstrologyProfile } from '../../api/astrology';
import { getOverallReading, type OverallReading } from '../../utils/astrologyOverall';
import { History, Activity, TrendingUp, CheckCircle, XCircle, User as UserIcon, Heart, Coins, Briefcase, Star, Flame, Sparkles } from 'lucide-react';

const AstrologyOverallTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [reading, setReading] = useState<OverallReading | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const profileId = new URLSearchParams(location.search).get('profileId') || undefined;
        // In the real system, getAstrologyProfile or a specific chart endpoint returns birthChart
        const result = await getAstrologyProfile(user.token);
        
        // We assume result has birthChart. If not, we might need to hit a specific chart endpoint or calculate it
        // From existing components (e.g. Current Tab), we saw they use getCurrentDaysHoroscope which returns birthChart
        // But the user requested "Overall Details" about the user chart. We can use the same calculation or endpoint.
        // Actually, the Astrology Dashboard already uses getAstrologyProfile which returns the profile, 
        // and some backend endpoint calculates the chart. Let's look at how AstrologyChartTab handles it.
        // To be safe and quick, we will just hit the `/current-days` endpoint which we know returns `birthChart`.
        
        const currentDaysData = await fetch(`http://localhost:5000/api/astrology/current-days${profileId ? `?profileId=${profileId}` : ''}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        }).then(res => res.json());

        setData(currentDaysData);
        
        if (currentDaysData?.birthChart) {
          const { ascendant, moonSign } = currentDaysData.birthChart;
          // Usually ascendant might be an object, or just a sign index. We assume it's just index from 1-12
          const ascIdx = typeof ascendant === 'object' ? ascendant.sign : ascendant;
          const moonIdx = typeof moonSign === 'object' ? moonSign.sign : moonSign;
          
          setReading(getOverallReading(ascIdx, moonIdx));
        }

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

  if (loading || !data || !reading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  const sections = [
    { title: "முன்ஜென்மம் (Past Life)", content: reading.pastLife, icon: History, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-950/20" },
    { title: "தற்போதைய வாழ்க்கை (Current Life)", content: reading.currentLife, icon: Activity, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-950/20" },
    { title: "எதிர்காலம் (Future Life)", content: reading.futureLife, icon: TrendingUp, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-950/20" },
    { title: "செய்ய வேண்டியவை (What to do)", content: reading.whatToDo, icon: CheckCircle, color: "text-green-400", border: "border-green-500/20", bg: "bg-green-950/20" },
    { title: "செய்யக் கூடாதவை (What not to do)", content: reading.whatNotToDo, icon: XCircle, color: "text-red-400", border: "border-red-500/20", bg: "bg-red-950/20" },
    { title: "உங்கள் குணம் (Character)", content: reading.character, icon: UserIcon, color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-950/20" },
    { title: "திருமண வாழ்க்கை (Marriage Life)", content: reading.marriageLife, icon: Heart, color: "text-pink-400", border: "border-pink-500/20", bg: "bg-pink-950/20" },
    { title: "பொருளாதாரம் (Money & Wealth)", content: reading.money, icon: Coins, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-950/20" },
    { title: "தொழில் மற்றும் வேலை (Career)", content: reading.career, icon: Briefcase, color: "text-orange-400", border: "border-orange-500/20", bg: "bg-orange-950/20" },
    { title: "லக்ன ரகசியம் (Lagnam Details)", content: reading.lagnamDetails, icon: Star, color: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-950/20" },
    { title: "வழிபட வேண்டிய தெய்வம் (God to Pray)", content: reading.godToPray, icon: Flame, color: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-950/20" }
  ];

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8 pb-12 max-w-6xl mx-auto px-4 md:px-0">
      
      {/* Header Section */}
      <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-10 border border-fuchsia-500/20 bg-gradient-to-br from-slate-900 to-fuchsia-950/20 shadow-[0_0_30px_rgba(217,70,239,0.15)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50"></div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-fuchsia-400" />
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-fuchsia-200">
            ஜாதக முழு விவரம்
          </h1>
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-fuchsia-400" />
        </div>
        <p className="text-fuchsia-200/80 text-base md:text-xl max-w-2xl mx-auto font-medium">
          உங்கள் ஜாதகத்தின் அடிப்படையிலான துல்லியமான மற்றும் ஆழமான 11 அம்ச பலன்கள்.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div 
              key={idx} 
              className={`glass p-6 rounded-2xl border ${section.border} ${section.bg} hover:scale-[1.02] transform transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <div className={`p-2 rounded-xl bg-slate-950/50 shadow-inner ${section.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className={`text-lg md:text-xl font-bold ${section.color}`}>
                  {section.title}
                </h2>
              </div>
              <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                {section.content}
              </p>
            </div>
          )
        })}
      </div>

    </div>
  );
};

export default AstrologyOverallTab;
