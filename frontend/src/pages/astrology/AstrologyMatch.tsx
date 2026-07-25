import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { calculateMatch, searchCities } from '../../api/astrology';
import { Heart, Search, Calendar, Clock, MapPin, User, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

const rasiTamilMap: Record<number, string> = {
  1: 'மேஷம்', 2: 'ரிஷபம்', 3: 'மிதுனம்', 4: 'கடகம்',
  5: 'சிம்மம்', 6: 'கன்னி', 7: 'துலாம்', 8: 'விருச்சிகம்',
  9: 'தனுசு', 10: 'மகரம்', 11: 'கும்பம்', 12: 'மீனம்'
};

const nakshatras = [
  'அஸ்வினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்', 
  'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை', 
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்', 
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'
];

const AstrologyMatch = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    partnerName: '',
    partnerGender: 'Female',
    partnerDob: '',
    partnerTob: ''
  });
  
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [userChart, setUserChart] = useState<any>(null);
  const [partnerChart, setPartnerChart] = useState<any>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (citySearch.length >= 3 && user?.token) {
        try {
          const results = await searchCities(user.token, citySearch);
          setCityResults(results);
        } catch (error) {
          console.error("Error fetching cities", error);
        }
      } else {
        setCityResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [citySearch, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) {
      alert('தயவுசெய்து துணையின் பிறந்த ஊரை தேர்ந்தெடுக்கவும்');
      return;
    }
    
    if (!user?.token) return;
    
    try {
      setLoading(true);
      const payload = {
        partnerDob: formData.partnerDob,
        partnerTob: formData.partnerTob,
        partnerGender: formData.partnerGender,
        partnerLat: selectedCity.lat,
        partnerLng: selectedCity.lng
      };
      
      const response = await calculateMatch(user.token, payload);
      setMatchResult(response.matchResult);
      setUserChart(response.userChart);
      setPartnerChart(response.partnerChart);
    } catch (error) {
      console.error(error);
      alert('பொருத்தம் கணிக்க முடியவில்லை (Error calculating match)');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Excellent') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/50';
    if (status === 'Good') return 'text-emerald-300 bg-emerald-400/10 border-emerald-400/50';
    if (status === 'Average') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/50';
  };

  const getStatusTamil = (status: string) => {
    if (status === 'Excellent') return 'உத்தமம் (மிக நன்று)';
    if (status === 'Good') return 'மத்திமம் (நன்று)';
    if (status === 'Average') return 'சுமார்';
    return 'பொருத்தமில்லை (Not Recommended)';
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="glass rounded-3xl p-8 border border-fuchsia-500/20 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-rose-900/30 to-fuchsia-950/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white">திருமண பொருத்தம்</h1>
          </div>
          <p className="text-rose-200/70 text-lg">துணையின் ஜாதக விவரங்களை உள்ளிட்டு தசவிதப் பொருத்தம் அறியவும்</p>
        </div>
      </div>

      {!matchResult ? (
        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-slate-700/50 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-rose-400" /> துணையின் பெயர்
              </label>
              <input 
                type="text" 
                required
                value={formData.partnerName}
                onChange={(e) => setFormData({...formData, partnerName: e.target.value})}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="பெயர்"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">பாலினம்</label>
              <div className="grid grid-cols-2 gap-4">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, partnerGender: g})}
                    className={`py-3 rounded-xl font-medium transition-all ${formData.partnerGender === g ? 'bg-rose-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
                  >
                    {g === 'Male' ? 'ஆண்' : 'பெண்'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" /> பிறந்த தேதி
              </label>
              <input 
                type="date" 
                required
                value={formData.partnerDob}
                onChange={(e) => setFormData({...formData, partnerDob: e.target.value})}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" /> பிறந்த நேரம்
              </label>
              <input 
                type="time" 
                required
                value={formData.partnerTob}
                onChange={(e) => setFormData({...formData, partnerTob: e.target.value})}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" /> பிறந்த ஊர் (City)
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={selectedCity ? `${selectedCity.name}, ${selectedCity.state}, ${selectedCity.country}` : citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setSelectedCity(null);
                }}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="எ.கா: Chennai"
              />
            </div>
            
            {cityResults.length > 0 && !selectedCity && (
              <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                {cityResults.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedCity(city);
                      setCitySearch('');
                      setCityResults([]);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 text-white border-b border-slate-700/50 last:border-0"
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-sm text-slate-400">{city.state}, {city.country}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-rose-600 to-fuchsia-600 hover:from-rose-500 hover:to-fuchsia-500 transition-all shadow-lg hover:shadow-rose-500/25 disabled:opacity-50 mt-8"
          >
            {loading ? 'கணிக்கப்படுகிறது...' : 'பொருத்தம் காண்க (Calculate Match)'}
          </button>
        </form>
      ) : (
        <div className="space-y-6 animate-slide-up-fade">
          <button 
            onClick={() => setMatchResult(null)}
            className="text-slate-400 hover:text-white mb-4"
          >
            ← மீண்டும் தேட (Search Again)
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border border-slate-700/50 text-center">
              <h3 className="text-xl font-bold text-white mb-2">உங்கள் விவரம்</h3>
              <p className="text-fuchsia-300 text-2xl font-black mb-1">{nakshatras[userChart.nakshatra - 1]}</p>
              <p className="text-slate-400">{rasiTamilMap[userChart.moonSign]} ராசி</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-slate-700/50 text-center">
              <h3 className="text-xl font-bold text-white mb-2">துணையின் விவரம்</h3>
              <p className="text-rose-300 text-2xl font-black mb-1">{nakshatras[partnerChart.nakshatra - 1]}</p>
              <p className="text-slate-400">{rasiTamilMap[partnerChart.moonSign]} ராசி</p>
            </div>
          </div>

          <div className={`glass p-8 rounded-3xl border text-center ${getStatusColor(matchResult.status)}`}>
            <p className="text-xl font-medium mb-2">மொத்த மதிப்பெண்</p>
            <div className="text-6xl font-black mb-4 flex items-center justify-center gap-2">
              {matchResult.totalScore} <span className="text-3xl text-inherit opacity-50">/ {matchResult.maxScore}</span>
            </div>
            <div className="text-2xl font-bold">
              {getStatusTamil(matchResult.status)}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-6">பொருத்த விவரங்கள்</h3>
            <div className="space-y-4">
              {matchResult.details.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex-1 w-full mb-2 md:mb-0">
                    <h4 className="font-bold text-white text-lg">{item.category}</h4>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-fuchsia-300">
                      {item.score} <span className="text-sm text-slate-500">/ {item.max}</span>
                    </div>
                    {item.score === item.max ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : item.score === 0 ? (
                      <XCircle className="w-6 h-6 text-rose-400" />
                    ) : (
                      <MinusCircle className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologyMatch;
