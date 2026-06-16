import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Zap, Sparkles, Shirt, MessageCircle, Heart, Brain, Trophy, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPersonalProfile } from '../../api/personal';

export default function PersonalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.token) return;
        const data = await getPersonalProfile(user.token);
        if (!data) {
          navigate('/personal/onboarding');
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  if (loading) return <div className="text-white text-center py-20">Loading Dashboard...</div>;
  if (!profile) return null;

  const modules = [
    { name: 'Appearance & Grooming', icon: Sparkles, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'hover:bg-amber-500/10', link: '/personal/appearance' },
    { name: 'Style & Dressing', icon: Shirt, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'hover:bg-rose-500/10', link: '/personal/style' },
    { name: 'Body Language', icon: User, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'hover:bg-indigo-500/10', link: '/personal/body-language' },
    { name: 'Communication', icon: MessageCircle, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'hover:bg-emerald-500/10', link: '/personal/communication' },
    { name: 'Confidence', icon: Shield, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'hover:bg-blue-500/10', link: '/personal/confidence' },
    { name: 'Social Skills', icon: Heart, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'hover:bg-pink-500/10', link: '/personal/social' },
    { name: 'Mindset', icon: Brain, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'hover:bg-purple-500/10', link: '/personal/mindset' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Summary Card */}
        <div className="glass rounded-2xl p-6 border border-white/10 md:w-1/3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] -mr-10 -mt-10" />
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-white/50 text-sm">{profile.occupation}</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Confidence</span>
                <span>{profile.confidenceLevel}/10</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(profile.confidenceLevel / 10) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Communication</span>
                <span>{profile.communicationLevel}/10</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(profile.communicationLevel / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Quick Actions */}
        <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Current Streak', value: `${profile.streak} Days`, icon: Zap, color: 'text-yellow-400' },
            { label: 'Lessons', value: profile.completedLessons.length, icon: Brain, color: 'text-purple-400' },
            { label: 'Challenges', value: profile.completedChallenges.length, icon: Trophy, color: 'text-orange-400' },
            { label: 'Badges', value: profile.badges.length, icon: Shield, color: 'text-blue-400' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center group"
            >
              <stat.icon className={`h-6 w-6 mb-2 ${stat.color} group-hover:scale-110 transition-transform`} />
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-white/50">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-indigo-400" />
          Development Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((mod, idx) => (
            <Link 
              to={mod.link} 
              key={idx}
              className={`group glass rounded-2xl p-6 border ${mod.border} ${mod.bg} transition-all duration-300 hover:-translate-y-1`}
            >
              <mod.icon className={`h-8 w-8 mb-4 ${mod.color} group-hover:scale-110 transition-transform`} />
              <h3 className="text-lg font-bold text-white mb-2">{mod.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Explore</span>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </Link>
          ))}
          
          <Link 
            to="/personal/challenges"
            className="group glass rounded-2xl p-6 border border-orange-500/30 hover:bg-orange-500/10 transition-all duration-300 hover:-translate-y-1"
          >
            <Trophy className="h-8 w-8 mb-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Daily Challenges</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Start</span>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span className="text-white text-xs">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
