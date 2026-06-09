import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { generateSummary } from '../../../services/resumeService';

export default function SummaryStep({ data, onChange }: { data: any, onChange: (summary: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const newSummary = await generateSummary({
        experience: data.experience,
        projects: data.projects,
        skills: data.skills,
        targetRole: data.targetRole
      });
      onChange(newSummary);
    } catch (err) {
      console.error(err);
      alert('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Professional Summary</h2>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
          {data.personalInfo.summary ? 'Regenerate with AI' : 'Generate with AI'}
        </button>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
        <p className="text-slate-400 text-sm mb-4">
          Write a short, engaging professional summary. Or, click the Generate button to let AI read your experience, projects, and skills to write an ATS-optimized summary for you.
        </p>
        
        <textarea 
          value={data.personalInfo.summary || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-purple-500 text-lg leading-relaxed"
          placeholder="e.g. Results-driven Full Stack Developer with 3 years of experience building scalable web applications..."
        />
        
        <div className="mt-2 text-right text-xs text-slate-500">
          {(data.personalInfo.summary?.length || 0)} characters (Aim for 200-400)
        </div>
      </div>
    </div>
  );
}
