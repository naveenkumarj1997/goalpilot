import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, User, Ruler, Activity, Shield, Dumbbell, ChevronRight } from 'lucide-react';
import { updateProfile, generateRoadmap, getProfile } from '../../api/combat';

const CombatOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    experienceLevel: '',
    goals: [] as string[],
    equipment: [] as string[]
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile && profile.gender) {
          setFormData({
            gender: profile.gender || '',
            age: profile.age?.toString() || '',
            weight: profile.weight?.toString() || '',
            height: profile.height?.toString() || '',
            experienceLevel: profile.experienceLevel || '',
            goals: profile.goals || [],
            equipment: profile.equipment || []
          });
        }
      } catch (e) {
        // Ignore, profile might not exist yet
      }
    };
    fetchProfile();
  }, []);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const toggleSelection = (field: 'goals' | 'equipment', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        age: parseInt(formData.age),
        weight: parseInt(formData.weight),
        height: parseInt(formData.height)
      });
      // Generate the AI Roadmap
      await generateRoadmap();
      navigate('/combat/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding', error);
      alert('Failed to generate your personalized roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 animate-slide-up-fade relative">
      <div className="text-center mb-12 relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="md:w-1/3 flex justify-end">
          <img src="/images/combat/boxer_hero.png" alt="Fighter" className="w-48 h-auto object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.6)] animate-float" />
        </div>
        <div className="md:w-2/3 text-left">
          <Shield className="w-12 h-12 text-brand mb-2 animate-ps-glow hidden md:block" />
          <h1 className="text-5xl font-black text-white neon-text-brand mb-2 italic tracking-tight uppercase">Combat Academy</h1>
          <p className="text-slate-400 text-lg">Let's build your personalized fighter roadmap.</p>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-red-500/30 relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <User className="mr-3 text-emerald-400" /> Basic Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Gender</label>
                <select 
                  className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Age</label>
                <input 
                  type="number"
                  placeholder="e.g. 25"
                  className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Weight (kg/lbs)</label>
                <input 
                  type="number"
                  placeholder="e.g. 75"
                  className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Height (cm)</label>
                <input 
                  type="number"
                  placeholder="e.g. 180"
                  className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand"
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={handleNext}
              disabled={!formData.gender || !formData.age || !formData.weight || !formData.height}
              className="w-full py-3 bg-brand text-white font-bold rounded-xl mt-6 disabled:opacity-50 flex justify-center items-center"
            >
              Next Step <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Activity className="mr-3 text-emerald-400" /> Experience Level
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                <div 
                  key={level}
                  onClick={() => setFormData({...formData, experienceLevel: level})}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.experienceLevel === level 
                    ? 'border-brand bg-brand/20 shadow-[0_0_15px_rgba(0,112,209,0.3)]' 
                    : 'border-emerald-500/20 bg-slate-900/50 hover:bg-slate-800'
                  }`}
                >
                  <h3 className="text-lg font-bold text-white">{level}</h3>
                  <p className="text-sm text-slate-400">
                    {level === 'Beginner' && "Never trained or very little experience."}
                    {level === 'Intermediate' && "Know the basics, have trained for a few months."}
                    {level === 'Advanced' && "Years of experience or competitive background."}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={handleBack} className="w-1/3 py-3 bg-slate-800 text-white font-bold rounded-xl">Back</button>
              <button 
                onClick={handleNext}
                disabled={!formData.experienceLevel}
                className="w-2/3 py-3 bg-brand text-white font-bold rounded-xl disabled:opacity-50 flex justify-center items-center"
              >
                Next Step <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="mr-3 text-emerald-400" /> Your Goals
            </h2>
            <p className="text-sm text-slate-400 mb-4">Select all that apply.</p>
            <div className="grid grid-cols-2 gap-3">
              {['Weight Loss', 'Fitness', 'Self Defense', 'Learn Boxing', 'Learn MMA', 'Learn Kickboxing', 'Build Confidence', 'Improve Cardio', 'Become Athletic'].map(goal => (
                <div 
                  key={goal}
                  onClick={() => toggleSelection('goals', goal)}
                  className={`p-3 rounded-xl border text-center text-sm font-bold cursor-pointer transition-all ${
                    formData.goals.includes(goal)
                    ? 'border-brand bg-brand/20 text-white shadow-[0_0_10px_rgba(0,112,209,0.3)]' 
                    : 'border-emerald-500/20 bg-slate-900/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {goal}
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={handleBack} className="w-1/3 py-3 bg-slate-800 text-white font-bold rounded-xl">Back</button>
              <button 
                onClick={handleNext}
                disabled={formData.goals.length === 0}
                className="w-2/3 py-3 bg-brand text-white font-bold rounded-xl disabled:opacity-50 flex justify-center items-center"
              >
                Next Step <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Dumbbell className="mr-3 text-emerald-400" /> Available Equipment
            </h2>
            <p className="text-sm text-slate-400 mb-4">What do you have access to?</p>
            <div className="grid grid-cols-2 gap-3">
              {['No Equipment', 'Jump Rope', 'Dumbbells', 'Resistance Bands', 'Heavy Bag', 'Boxing Gloves', 'MMA Gloves', 'Full Home Gym'].map(eq => (
                <div 
                  key={eq}
                  onClick={() => toggleSelection('equipment', eq)}
                  className={`p-3 rounded-xl border text-center text-sm font-bold cursor-pointer transition-all ${
                    formData.equipment.includes(eq)
                    ? 'border-brand bg-brand/20 text-white shadow-[0_0_10px_rgba(0,112,209,0.3)]' 
                    : 'border-emerald-500/20 bg-slate-900/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {eq}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={handleBack} className="w-1/3 py-3 bg-slate-800 text-white font-bold rounded-xl">Back</button>
              <button 
                onClick={handleSubmit}
                disabled={loading || formData.equipment.length === 0}
                className="w-2/3 py-3 bg-gradient-to-r from-emerald-500 to-brand text-white font-bold rounded-xl disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(0,112,209,0.4)]"
              >
                {loading ? 'Generating Roadmap...' : 'Generate Roadmap'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatOnboarding;
