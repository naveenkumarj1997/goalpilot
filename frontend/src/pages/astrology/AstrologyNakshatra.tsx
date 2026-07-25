import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTodayHoroscope } from '../../api/astrology';
import { Star, Sparkles, BookOpen } from 'lucide-react';

const nakshatras = [
  { name: 'அஸ்வினி (Ashwini)', lord: 'கேது', rasi: 'மேஷம்' },
  { name: 'பரணி (Bharani)', lord: 'சுக்கிரன்', rasi: 'மேஷம்' },
  { name: 'கிருத்திகை (Krittika)', lord: 'சூரியன்', rasi: 'மேஷம்/ரிஷபம்' },
  { name: 'ரோகிணி (Rohini)', lord: 'சந்திரன்', rasi: 'ரிஷபம்' },
  { name: 'மிருகசீரிடம் (Mrigashira)', lord: 'செவ்வாய்', rasi: 'ரிஷபம்/மிதுனம்' },
  { name: 'திருவாதிரை (Ardra)', lord: 'ராகு', rasi: 'மிதுனம்' },
  { name: 'புனர்பூசம் (Punarvasu)', lord: 'குரு', rasi: 'மிதுனம்/கடகம்' },
  { name: 'பூசம் (Pushya)', lord: 'சனி', rasi: 'கடகம்' },
  { name: 'ஆயில்யம் (Ashlesha)', lord: 'புதன்', rasi: 'கடகம்' },
  { name: 'மகம் (Magha)', lord: 'கேது', rasi: 'சிம்மம்' },
  { name: 'பூரம் (Purva Phalguni)', lord: 'சுக்கிரன்', rasi: 'சிம்மம்' },
  { name: 'உத்திரம் (Uttara Phalguni)', lord: 'சூரியன்', rasi: 'சிம்மம்/கன்னி' },
  { name: 'அஸ்தம் (Hasta)', lord: 'சந்திரன்', rasi: 'கன்னி' },
  { name: 'சித்திரை (Chitra)', lord: 'செவ்வாய்', rasi: 'கன்னி/துலாம்' },
  { name: 'சுவாதி (Swati)', lord: 'ராகு', rasi: 'துலாம்' },
  { name: 'விசாகம் (Vishakha)', lord: 'குரு', rasi: 'துலாம்/விருச்சிகம்' },
  { name: 'அனுஷம் (Anuradha)', lord: 'சனி', rasi: 'விருச்சிகம்' },
  { name: 'கேட்டை (Jyeshtha)', lord: 'புதன்', rasi: 'விருச்சிகம்' },
  { name: 'மூலம் (Mula)', lord: 'கேது', rasi: 'தனுசு' },
  { name: 'பூராடம் (Purva Ashadha)', lord: 'சுக்கிரன்', rasi: 'தனுசு' },
  { name: 'உத்திராடம் (Uttara Ashadha)', lord: 'சூரியன்', rasi: 'தனுசு/மகரம்' },
  { name: 'திருவோணம் (Shravana)', lord: 'சந்திரன்', rasi: 'மகரம்' },
  { name: 'அவிட்டம் (Dhanishta)', lord: 'செவ்வாய்', rasi: 'மகரம்/கும்பம்' },
  { name: 'சதயம் (Shatabhisha)', lord: 'ராகு', rasi: 'கும்பம்' },
  { name: 'பூரட்டாதி (Purva Bhadrapada)', lord: 'குரு', rasi: 'கும்பம்/மீனம்' },
  { name: 'உத்திரட்டாதி (Uttara Bhadrapada)', lord: 'சனி', rasi: 'மீனம்' },
  { name: 'ரேவதி (Revati)', lord: 'புதன்', rasi: 'மீனம்' }
];

const AstrologyNakshatra = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const profileId = new URLSearchParams(location.search).get('profileId') || undefined;
        const result = await getTodayHoroscope(user.token, profileId);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch nakshatra details:", error);
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

  const { birthChart } = data;
  const nakshatraIndex = birthChart.moonNakshatra - 1;
  const nakshatraInfo = nakshatras[nakshatraIndex];

  return (
    <div className="animate-fade-in space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="glass rounded-3xl p-8 border border-fuchsia-500/20 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-slate-900 to-fuchsia-950/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-fuchsia-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white">ஜென்ம நட்சத்திரம்</h1>
          </div>
          <p className="text-fuchsia-200/70 text-lg">உங்கள் பிறந்த நட்சத்திரத்தின் சிறப்பம்சங்கள்</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-fuchsia-500/50 bg-fuchsia-900/10 text-center">
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-4xl font-black text-fuchsia-300 mb-2">{nakshatraInfo.name}</h2>
          <p className="text-lg text-slate-300">ஜென்ம நட்சத்திரம்</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-slate-700/50 flex flex-col justify-center space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-lg text-slate-300">நட்சத்திர அதிபதி</span>
            </div>
            <span className="text-xl font-bold text-white">{nakshatraInfo.lord}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-lg text-slate-300">பொருந்தும் ராசி</span>
            </div>
            <span className="text-xl font-bold text-white">{nakshatraInfo.rasi}</span>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-slate-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">பொது குணநலன்கள்</h2>
        <p className="text-slate-300 leading-relaxed text-lg">
          {nakshatraInfo.name} நட்சத்திரத்தில் பிறந்த நீங்கள் பொதுவாக மிகவும் அன்பானவர்கள். 
          தன்னம்பிக்கையும் தைரியமும் உங்களின் சிறப்பம்சங்கள். உங்களின் நட்சத்திர அதிபதி {nakshatraInfo.lord} என்பதால், 
          உங்களுக்கு இயல்பாகவே தலைமை பண்பு மற்றும் மற்றவர்களை கவரும் திறன் இருக்கும்.
          <br /><br />
          (குறிப்பு: இது ஒரு அடிப்படை தகவல். முழுமையான ஜாதக கணிப்பின் மூலம் விரிவான குணநலன்களை அறிய முடியும்.)
        </p>
      </div>
    </div>
  );
};

export default AstrologyNakshatra;
