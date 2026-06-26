import React, { useState } from 'react';
import { Brain, ChevronRight, Target, Clock, BookOpen, User, Briefcase, Play, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setupBrainProfile } from '../../api/brain';
import { useAuth } from '../../context/AuthContext';

const BrainOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    age: 25,
    profession: 'Student' as 'Student' | 'Professional',
    learningGoals: [] as string[],
    examPreparation: false,
    interviewPreparation: false,
    dailyStudyHours: 2,
    preferredSubjects: [] as string[]
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      await setupBrainProfile(user.token, formData);
      navigate('/brain/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to setup profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (field: 'learningGoals' | 'preferredSubjects', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 animate-slide-up-fade">
      <div className="max-w-2xl mx-auto glass p-8 rounded-3xl border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse-slow" />
          <h1 className="text-3xl font-black text-white mb-2">Welcome to Brain Academy</h1>
          <p className="text-slate-400">Let's configure your neuro-plasticity training protocol.</p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-slide-up-fade">
              <h2 className="text-xl font-bold text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" /> Basic Intel
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">How old are you?</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                  className="w-full bg-slate-900/50 border border-blue-500/30 rounded-xl p-3 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Status</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['Student', 'Professional'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setFormData({...formData, profession: p})}
                      className={`p-4 rounded-xl border transition-all ${formData.profession === p ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-blue-500/50'}`}
                    >
                      <Briefcase className="w-6 h-6 mx-auto mb-2" />
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleNext} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center transition-colors">
                Next Phase <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-up-fade">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" /> Mission Objectives
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 bg-slate-900/50 border border-slate-700 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                  <input type="checkbox" checked={formData.examPreparation} onChange={e => setFormData({...formData, examPreparation: e.target.checked})} className="mr-4 w-5 h-5 accent-blue-500" />
                  <div>
                    <span className="block text-white font-medium">Exam Preparation</span>
                    <span className="text-xs text-slate-400">Train for upcoming tests and certifications</span>
                  </div>
                </label>
                
                <label className="flex items-center p-4 bg-slate-900/50 border border-slate-700 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                  <input type="checkbox" checked={formData.interviewPreparation} onChange={e => setFormData({...formData, interviewPreparation: e.target.checked})} className="mr-4 w-5 h-5 accent-blue-500" />
                  <div>
                    <span className="block text-white font-medium">Interview Preparation</span>
                    <span className="text-xs text-slate-400">Master rapid recall for technical interviews</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Primary Goals (Select Multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {['Improve Memory', 'Read Faster', 'Learn New Language', 'Coding Mastery', 'Focus & Attention', 'Public Speaking'].map(goal => (
                    <button
                      key={goal}
                      onClick={() => toggleArrayItem('learningGoals', goal)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${formData.learningGoals.includes(goal) ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-500'}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                  Back
                </button>
                <button onClick={handleNext} className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center transition-colors">
                  Next Phase <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slide-up-fade">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" /> Time Commitment
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-4">Daily Study Hours Goal: <span className="text-blue-400 font-bold text-xl">{formData.dailyStudyHours} hrs</span></label>
                <input 
                  type="range" min="0.5" max="10" step="0.5" 
                  value={formData.dailyStudyHours}
                  onChange={e => setFormData({...formData, dailyStudyHours: parseFloat(e.target.value)})}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>30 mins</span>
                  <span>10 hours</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleBack} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                  Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><Play className="w-5 h-5 mr-2 fill-current" /> Initialize Brain Academy</>}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BrainOnboarding;
