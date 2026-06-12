import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutApi } from '../../api/workoutApi';
import { User, Target, Activity, Dumbbell, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FitnessProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    gender: 'Male',
    age: 25,
    height: 175,
    weight: 70,
    fitnessLevel: 'Beginner',
    goal: 'Muscle Gain',
    equipment: ['None'] as string[],
    daysPerWeek: 3,
    timePerDay: 30
  });

  useEffect(() => {
    workoutApi.getProfile()
      .then(res => {
        if (res.data) setProfile(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await workoutApi.updateProfile(profile);
      await workoutApi.generatePlan();
      navigate('/workouts/plan');
    } catch (err) {
      console.error(err);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleEquipment = (eq: string) => {
    setProfile(prev => ({
      ...prev,
      equipment: prev.equipment.includes(eq) 
        ? prev.equipment.filter(e => e !== eq)
        : [...prev.equipment, eq]
    }));
  };

  if (loading) return <div className="text-white p-8 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Build Your Fitness Profile</h1>
        <p className="text-slate-400">Let's personalize your home workout experience.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-brand' : 'bg-slate-800'}`} />
        ))}
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center"><User className="mr-3 text-brand" /> Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Gender</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand"
                  value={profile.gender}
                  onChange={e => setProfile({...profile, gender: e.target.value})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Age</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand"
                  value={profile.age}
                  onChange={e => setProfile({...profile, age: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Height (cm)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand"
                  value={profile.height}
                  onChange={e => setProfile({...profile, height: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Weight (kg)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand"
                  value={profile.weight}
                  onChange={e => setProfile({...profile, weight: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center"><Activity className="mr-3 text-brand" /> Fitness Level</h2>
            <div className="grid grid-cols-1 gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setProfile({...profile, fitnessLevel: lvl})}
                  className={`p-4 rounded-xl border text-left transition-all ${profile.fitnessLevel === lvl ? 'border-brand bg-brand/20 text-white' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'}`}
                >
                  <h3 className="font-bold text-lg">{lvl}</h3>
                  <p className="text-sm opacity-80 mt-1">
                    {lvl === 'Beginner' ? 'New to working out or returning after a long break.' : lvl === 'Intermediate' ? 'Workout regularly, looking to push further.' : 'Experienced athlete seeking a challenge.'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center"><Target className="mr-3 text-brand" /> Primary Goal</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Weight Loss', 'Fat Loss', 'Muscle Gain', 'Strength', 'Endurance', 'General Fitness'].map(goal => (
                <button
                  key={goal}
                  onClick={() => setProfile({...profile, goal})}
                  className={`p-4 rounded-xl border text-center transition-all ${profile.goal === goal ? 'border-brand bg-brand/20 text-white font-bold shadow-[0_0_15px_rgba(0,112,209,0.3)]' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'}`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center"><Dumbbell className="mr-3 text-brand" /> Available Equipment</h2>
            <p className="text-sm text-slate-400">Select all that you have at home.</p>
            <div className="grid grid-cols-2 gap-4">
              {['None', 'Dumbbells', 'Resistance Bands', 'Pull-up Bar', 'Bench'].map(eq => (
                <button
                  key={eq}
                  onClick={() => toggleEquipment(eq)}
                  className={`p-4 rounded-xl border text-center transition-all ${profile.equipment.includes(eq) ? 'border-brand bg-brand/20 text-white font-bold' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'}`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center"><Calendar className="mr-3 text-brand" /> Commitment</h2>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Days per Week ({profile.daysPerWeek})</label>
              <input 
                type="range" min="1" max="7" 
                className="w-full accent-brand"
                value={profile.daysPerWeek}
                onChange={e => setProfile({...profile, daysPerWeek: Number(e.target.value)})}
              />
            </div>

            <div className="pt-4">
              <label className="block text-sm text-slate-400 mb-2 flex items-center"><Clock className="w-4 h-4 mr-2" /> Time per Day ({profile.timePerDay} mins)</label>
              <input 
                type="range" min="15" max="90" step="15"
                className="w-full accent-brand"
                value={profile.timePerDay}
                onChange={e => setProfile({...profile, timePerDay: Number(e.target.value)})}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between pt-6 border-t border-white/10">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">
              Back
            </button>
          ) : <div />}
          
          {step < 5 ? (
            <button 
              onClick={() => setStep(step + 1)} 
              className="px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold flex items-center shadow-[0_0_15px_rgba(0,112,209,0.5)] transition-all"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50"
            >
              {saving ? 'Generating Plan...' : 'Generate Plan'} <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
