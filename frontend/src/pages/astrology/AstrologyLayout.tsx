import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Star, Calendar, Globe, Heart, Plus, Users, UserCircle, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAstrologyProfile } from '../../api/astrology';

const AstrologyLayout = () => {
  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();
  const location = useLocation();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  useEffect(() => {
    if (token) {
      getAstrologyProfile(token).then((data) => {
        if (Array.isArray(data)) {
          setProfiles(data);
          // Get profileId from URL query params if present, else use primary
          const params = new URLSearchParams(location.search);
          const urlProfileId = params.get('profileId');
          
          if (urlProfileId && data.find(p => p._id === urlProfileId)) {
            setSelectedProfileId(urlProfileId);
          } else if (data.length > 0) {
            const primary = data.find(p => p.isPrimary) || data[0];
            setSelectedProfileId(primary._id);
          } else {
            // No profiles, force to register
            if (!location.pathname.includes('/register')) {
              navigate('/astrology/register');
            }
          }
        }
      }).catch(console.error);
    }
  }, [token, location.pathname, location.search, navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'new') {
      navigate('/astrology/register');
    } else if (val) {
      setSelectedProfileId(val);
      // Preserve the current path but update the query parameter
      navigate(`${location.pathname}?profileId=${val}`);
    }
  };

  const navParams = selectedProfileId ? `?profileId=${selectedProfileId}` : '';
  const isNotesPage = location.pathname.includes('/astrology/notes');

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-fuchsia-500/30 flex flex-col">
      <div className="absolute inset-0 bg-[url('/images/stars_bg.png')] opacity-20 pointer-events-none mix-blend-screen" />
      
      {/* Top Navigation for Astrology Module */}
      <div className="sticky top-0 z-50 glass border-b border-fuchsia-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center justify-between md:justify-start gap-4">
            <div className="flex items-center gap-2">
              <Moon className="w-6 h-6 text-fuchsia-400" />
              <span className="font-bold text-xl tracking-wide hidden sm:block">ஜோதிடம்</span>
            </div>
            
            {/* Profile Switcher */}
            {!isNotesPage && profiles.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-fuchsia-400" />
                <select 
                  value={selectedProfileId} 
                  onChange={handleProfileChange}
                  className="bg-slate-900 border border-fuchsia-500/30 rounded-lg px-2 py-1 text-sm text-fuchsia-100 focus:outline-none focus:border-fuchsia-400 max-w-[150px] sm:max-w-[200px]"
                >
                  {profiles.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} {p.relation ? `(${p.relation})` : ''}
                    </option>
                  ))}
                  {profiles.length < 5 && (
                    <option value="new"> + புதிய ஜாதகம் (New)</option>
                  )}
                </select>
                <button onClick={() => navigate(`/astrology/register?edit=${selectedProfileId}`)} className="text-xs text-fuchsia-400 hover:text-fuchsia-300 underline">
                  Edit
                </button>
              </div>
            )}
          </div>
          
          {!isNotesPage && (
            <nav className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
              <NavLink to={`/astrology${navParams}`} end className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive && location.pathname === '/astrology' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Star className="w-4 h-4" /> பலன்
              </NavLink>
              <NavLink to={`/astrology/overall${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Sparkles className="w-4 h-4" /> முழு விவரம்
              </NavLink>
              <NavLink to={`/astrology/current${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Clock className="w-4 h-4" /> தற்போதைய
              </NavLink>
              <NavLink to={`/astrology/chart${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <UserCircle className="w-4 h-4" /> சக்கரம்
              </NavLink>
              <NavLink to={`/astrology/planets${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Globe className="w-4 h-4" /> கிரகங்கள்
              </NavLink>
              <NavLink to={`/astrology/nakshatra${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Moon className="w-4 h-4" /> நட்சத்திரம்
              </NavLink>
              <NavLink to={`/astrology/dasha${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Calendar className="w-4 h-4" /> தசா புக்தி
              </NavLink>
              <NavLink to={`/astrology/transit${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Globe className="w-4 h-4" /> கோச்சாரம்
              </NavLink>
              <NavLink to={`/astrology/match${navParams}`} className={({isActive}) => `flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'}`}>
                <Heart className="w-4 h-4" /> பொருத்தம்
              </NavLink>
            </nav>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full flex-1 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AstrologyLayout;
