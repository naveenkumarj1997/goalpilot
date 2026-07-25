import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createOrUpdateAstrologyProfile, searchCities, getAstrologyProfile, deleteAstrologyProfile } from '../../api/astrology';
import { Moon, MapPin, Search, Calendar, Clock, User, ChevronRight, Users, Trash2 } from 'lucide-react';

const AstrologyRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    _id: '',
    relation: 'Self',
    name: user?.name || '',
    gender: 'Male',
    dateOfBirth: '',
    timeOfBirth: '',
    language: 'ta'
  });
  
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // If editId is provided, fetch profiles and prefill
    if (editId && user?.token) {
      getAstrologyProfile(user.token).then(profiles => {
        const profile = profiles.find((p: any) => p._id === editId);
        if (profile) {
          const dob = new Date(profile.dateOfBirth);
          const formattedDob = dob.toISOString().split('T')[0]; // YYYY-MM-DD
          
          setFormData({
            _id: profile._id,
            relation: profile.relation || 'Self',
            name: profile.name,
            gender: profile.gender,
            dateOfBirth: formattedDob,
            timeOfBirth: profile.timeOfBirth,
            language: profile.language || 'ta'
          });
          
          setSelectedCity({
            name: profile.placeOfBirth.city,
            state: profile.placeOfBirth.state,
            country: profile.placeOfBirth.country,
            lat: profile.placeOfBirth.lat,
            lng: profile.placeOfBirth.lng
          });
        }
      });
    } else {
      // Default to "Friend" if they are creating a new profile but already have a primary one
      if (user?.token) {
        getAstrologyProfile(user.token).then(profiles => {
          if (profiles.length > 0) {
            setFormData(prev => ({ ...prev, relation: 'Friend', name: '' }));
          }
        });
      }
    }
  }, [editId, user?.token]);

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
  }, [citySearch, user?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) {
      alert('தயவுசெய்து உங்கள் பிறந்த ஊரை தேர்ந்தெடுக்கவும் (Please select a birth city)');
      return;
    }
    
    if (!user?.token) return;
    
    try {
      setLoading(true);
      const profileData: any = {
        name: formData.name,
        relation: formData.relation,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        placeOfBirth: {
          city: selectedCity.name,
          state: selectedCity.state,
          country: selectedCity.country,
          lat: selectedCity.lat,
          lng: selectedCity.lng
        },
        language: formData.language
      };

      if (formData._id) {
        profileData._id = formData._id;
      }
      
      await createOrUpdateAstrologyProfile(user.token, profileData);
      // Navigate to the astrology dashboard with this profile selected
      navigate(`/astrology${profileData._id ? `?profileId=${profileData._id}` : ''}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData._id || !user?.token) return;
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        setDeleting(true);
        await deleteAstrologyProfile(user.token, formData._id);
        navigate('/astrology');
      } catch (error) {
        console.error(error);
        alert('Failed to delete profile');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-12 px-2 sm:px-0 animate-slide-up-fade">
      <div className="text-center mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-fuchsia-900/30 rounded-full flex items-center justify-center mb-4 border border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
          <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">ஜோதிட விவரங்கள்</h1>
        <p className="text-slate-400 text-sm sm:text-base">உங்களின் துல்லியமான ஜாதகத்தை கணிக்க பிறந்த விவரங்களை உள்ளிடவும்.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-5 sm:p-8 rounded-3xl border border-slate-700/50 space-y-5 sm:space-y-6 relative">
        
        {formData._id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 p-2 rounded-full transition-colors disabled:opacity-50"
            title="Delete Profile"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-fuchsia-400" /> உறவு (Relation)
            </label>
            <select 
              value={formData.relation}
              onChange={(e) => setFormData({...formData, relation: e.target.value})}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors appearance-none"
            >
              <option value="Self">நான் (Self)</option>
              <option value="Friend">நண்பர் (Friend)</option>
              <option value="Family">குடும்பம் (Family)</option>
              <option value="Other">மற்றவை (Other)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-fuchsia-400" /> பெயர்
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
              placeholder="பெயர்"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300">பாலினம் (Gender)</label>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {['Male', 'Female', 'Other'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFormData({...formData, gender: g})}
                className={`py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${formData.gender === g ? 'bg-fuchsia-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
              >
                {g === 'Male' ? 'ஆண்' : g === 'Female' ? 'பெண்' : 'மற்றவை'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-fuchsia-400" /> பிறந்த தேதி
            </label>
            <input 
              type="date" 
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-fuchsia-400" /> பிறந்த நேரம்
            </label>
            <input 
              type="time" 
              required
              value={formData.timeOfBirth}
              onChange={(e) => setFormData({...formData, timeOfBirth: e.target.value})}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-fuchsia-400" /> பிறந்த ஊர் (City)
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : citySearch}
              onChange={(e) => {
                setSelectedCity(null);
                setCitySearch(e.target.value);
              }}
              placeholder="Search your city..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
            />
            <Search className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
          </div>

          {cityResults.length > 0 && !selectedCity && (
            <div className="absolute z-20 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
              {cityResults.map((city, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityResults([]);
                    setCitySearch('');
                  }}
                  className="px-4 py-3 hover:bg-slate-700 cursor-pointer text-white border-b border-slate-700/50 last:border-0 flex flex-col sm:flex-row justify-between sm:items-center"
                >
                  <div>
                    <span className="font-bold block sm:inline">{city.name}</span>
                    <span className="text-xs text-slate-400 sm:ml-2 block sm:inline">{city.state && `${city.state},`} {city.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !selectedCity}
          className="w-full mt-6 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Processing...' : (formData._id ? 'புதுப்பிக்க (Update)' : 'ஜாதகத்தை உருவாக்கு')}
          {!loading && <ChevronRight className="w-5 h-5" />}
        </button>

      </form>
    </div>
  );
};

export default AstrologyRegistration;
