import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResumeById, updateResume } from '../../services/resumeService';
import { Save, ArrowLeft, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationStep from './steps/EducationStep';
import ExperienceStep from './steps/ExperienceStep';
import ProjectsStep from './steps/ProjectsStep';
import CertificationsStep from './steps/CertificationsStep';
import SkillsStep from './steps/SkillsStep';
import SummaryStep from './steps/SummaryStep';

const STEPS = [
  'Personal Info',
  'Education',
  'Experience',
  'Projects',
  'Certifications',
  'Skills',
  'Summary'
];

export default function ResumeBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      getResumeById(id).then(setResume).catch(console.error);
    }
  }, [id]);

  const handleSave = async (silent = false) => {
    if (!resume || !id) return;
    try {
      if (!silent) setSaving(true);
      await updateResume(id, resume);
    } catch (err) {
      console.error('Failed to save resume', err);
    } finally {
      if (!silent) setSaving(false);
    }
  };

  if (!resume) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PersonalInfoStep data={resume.personalInfo} onChange={(data) => setResume({...resume, personalInfo: data})} />;
      case 1: return <EducationStep data={resume.education} onChange={(data) => setResume({...resume, education: data})} />;
      case 2: return <ExperienceStep data={resume.experience} targetRole={resume.targetRole} onChange={(data) => setResume({...resume, experience: data})} />;
      case 3: return <ProjectsStep data={resume.projects} targetRole={resume.targetRole} onChange={(data) => setResume({...resume, projects: data})} />;
      case 4: return <CertificationsStep data={resume} updateData={(data: any) => setResume({...resume, ...data})} />;
      case 5: return <SkillsStep data={resume.skills} onChange={(data) => setResume({...resume, skills: data})} />;
      case 6: return <SummaryStep data={resume} onChange={(data) => setResume({...resume, personalInfo: {...resume.personalInfo, summary: data}})} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/resume')} className="mr-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <input 
            type="text" 
            value={resume.title} 
            onChange={(e) => setResume({...resume, title: e.target.value})}
            className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-purple-500 text-2xl font-bold text-white focus:outline-none px-2 py-1 transition-colors"
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => handleSave()}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={() => { handleSave(true); navigate(`/resume/${id}/preview`); }}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-lg text-white font-bold transition-all"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview & ATS
          </button>
        </div>
      </div>

      {/* Target Role Selector */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-8 border border-slate-700 flex items-center">
        <label className="text-slate-400 font-medium mr-4 whitespace-nowrap">Target Role:</label>
        <input 
          type="text" 
          placeholder="e.g. Full Stack Developer" 
          value={resume.targetRole || ''}
          onChange={(e) => setResume({...resume, targetRole: e.target.value})}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
        />
        <p className="text-xs text-slate-500 ml-4 hidden md:block">AI uses this to optimize suggestions.</p>
      </div>

      {/* Step Progress */}
      <div className="flex overflow-x-auto mb-8 pb-2 hide-scrollbar">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center">
            <button 
              onClick={() => setCurrentStep(index)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === index ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {index + 1}. {step}
            </button>
            {index < STEPS.length - 1 && (
              <div className="w-8 h-px bg-slate-700 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl min-h-[400px]">
        {renderStep()}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center px-6 py-3 bg-slate-800 disabled:opacity-50 hover:bg-slate-700 rounded-xl text-slate-300 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <button 
          onClick={() => {
            handleSave(true);
            if (currentStep < STEPS.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              navigate(`/resume/${id}/preview`);
            }
          }}
          className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        >
          {currentStep === STEPS.length - 1 ? 'Finish & Preview' : 'Next Step'} <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
