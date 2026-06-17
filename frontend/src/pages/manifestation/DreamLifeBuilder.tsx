import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Save, Compass, Home, Heart, Briefcase, DollarSign, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getManifestationProfile, updateManifestationProfile } from '../../api/manifestation';

export default function DreamLifeBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dreamCareer: '',
    dreamIncome: '',
    dreamBody: '',
    dreamLifestyle: '',
    dreamRelationships: '',
    dreamSkills: '',
    dreamHome: '',
    dreamTravel: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.token) return;
        const data = await getManifestationProfile(user.token);
        if (data) {
          setFormData({
            dreamCareer: data.dreamCareer || '',
            dreamIncome: data.dreamIncome || '',
            dreamBody: data.dreamBody || '',
            dreamLifestyle: data.dreamLifestyle || '',
            dreamRelationships: data.dreamRelationships || '',
            dreamSkills: data.dreamSkills || '',
            dreamHome: data.dreamHome || '',
            dreamTravel: data.dreamTravel || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (user?.token) {
        await updateManifestationProfile(formData, user.token);
        navigate('/manifestation/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading Builder...</div>;

  const sections = [
    { id: 'dreamCareer', label: 'Dream Career', icon: Briefcase, placeholder: 'Describe your perfect job, business, or career path...', color: 'text-blue-400' },
    { id: 'dreamIncome', label: 'Dream Income', icon: DollarSign, placeholder: 'What does financial abundance look like for you?', color: 'text-emerald-400' },
    { id: 'dreamBody', label: 'Dream Body & Health', icon: Sparkles, placeholder: 'How do you want to look and feel every day?', color: 'text-amber-400' },
    { id: 'dreamLifestyle', label: 'Dream Lifestyle', icon: Compass, placeholder: 'Describe a perfect day in your ideal life...', color: 'text-purple-400' },
    { id: 'dreamRelationships', label: 'Dream Relationships', icon: Heart, placeholder: 'What kind of people surround you?', color: 'text-rose-400' },
    { id: 'dreamHome', label: 'Dream Home', icon: Home, placeholder: 'Where do you live? What does your home look like?', color: 'text-indigo-400' },
    { id: 'dreamTravel', label: 'Dream Travel', icon: Globe, placeholder: 'What places are you exploring?', color: 'text-cyan-400' }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Dream Life Builder</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Clarity is the first step to manifestation. Describe exactly what you want in each area of your life in deep, vivid detail.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl border border-white/10"
          >
            <div className="flex items-center mb-4">
              <section.icon className={`w-6 h-6 mr-3 ${section.color}`} />
              <h2 className="text-xl font-bold text-white">{section.label}</h2>
            </div>
            <textarea
              name={section.id}
              value={formData[section.id as keyof typeof formData]}
              onChange={handleChange}
              placeholder={section.placeholder}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[120px] resize-y"
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50"
        >
          {saving ? 'Saving...' : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Vision
            </>
          )}
        </button>
      </div>
    </div>
  );
}