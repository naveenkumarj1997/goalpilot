import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createOrUpdatePersonalProfile } from '../../api/personal';

export default function PersonalOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    occupation: '',
    goals: [] as string[],
    confidenceLevel: 5,
    communicationLevel: 5,
    fitnessLevel: 5
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async () => {
    if (!user?.token) return;
    
    setError('');
    
    if (!formData.age || !formData.height || !formData.weight || !formData.occupation) {
      setError('Please fill out all required fields (Age, Height, Weight, Occupation).');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight)
      };
      await createOrUpdatePersonalProfile(submitData, user.token);
      navigate('/personal/dashboard');
    } catch (err) {
      console.error('Failed to save profile', err);
      setError('Failed to save profile. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-2xl rounded-2xl p-8 border border-white/10"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
            <User className="h-8 w-8 text-indigo-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">Your Personal Identity</h1>
        <p className="text-center text-white/50 mb-8">Let's build your profile to personalize your development journey.</p>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                >
                  <option className="bg-gray-900">Male</option>
                  <option className="bg-gray-900">Female</option>
                  <option className="bg-gray-900">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Occupation / Student</label>
              <input 
                type="text" 
                value={formData.occupation}
                onChange={e => setFormData({...formData, occupation: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <button onClick={handleNext} className="w-full py-3 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors mt-6">Next Step</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Self Assessment</h2>
            
            <div>
              <label className="flex justify-between text-sm text-white/70 mb-2">
                <span>Confidence Level</span>
                <span className="text-indigo-400 font-bold">{formData.confidenceLevel}/10</span>
              </label>
              <input 
                type="range" min="1" max="10" 
                value={formData.confidenceLevel}
                onChange={e => setFormData({...formData, confidenceLevel: parseInt(e.target.value)})}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-white/70 mb-2">
                <span>Communication Skills</span>
                <span className="text-indigo-400 font-bold">{formData.communicationLevel}/10</span>
              </label>
              <input 
                type="range" min="1" max="10" 
                value={formData.communicationLevel}
                onChange={e => setFormData({...formData, communicationLevel: parseInt(e.target.value)})}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-white/70 mb-2">
                <span>Physical Fitness</span>
                <span className="text-indigo-400 font-bold">{formData.fitnessLevel}/10</span>
              </label>
              <input 
                type="range" min="1" max="10" 
                value={formData.fitnessLevel}
                onChange={e => setFormData({...formData, fitnessLevel: parseInt(e.target.value)})}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={handlePrev} className="flex-1 py-3 bg-white/5 text-white rounded-lg font-bold hover:bg-white/10 transition-colors">Back</button>
              <button onClick={handleNext} className="flex-1 py-3 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors">Next Step</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">What are your primary goals?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Build Confidence', 'Improve Style', 'Better Communication', 'Grooming & Hygiene', 'Body Language', 'Social Skills', 'Mindset & Discipline'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.goals.includes(goal)
                      ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'border-white/10 bg-black/20 text-white/60 hover:bg-white/5'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={handlePrev} className="flex-1 py-3 bg-white/5 text-white rounded-lg font-bold hover:bg-white/10 transition-colors">Back</button>
              <button disabled={loading} onClick={handleSubmit} className="flex-1 py-3 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50">
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
            {error && <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm text-center font-bold">{error}</div>}
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
