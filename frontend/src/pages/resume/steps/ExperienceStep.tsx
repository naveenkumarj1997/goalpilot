import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Loader2 } from 'lucide-react';
import { enhanceBullet } from '../../../services/resumeService';

export default function ExperienceStep({ data, targetRole, onChange }: { data: any[], targetRole: string, onChange: (data: any[]) => void }) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    onChange([...data, { company: '', role: '', location: '', startDate: '', endDate: '', description: '' }]);
  };

  const handleRemove = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newData = [...data];
    newData[index][e.target.name] = e.target.value;
    onChange(newData);
  };

  const handleEnhance = async (index: number) => {
    const bullet = data[index].description;
    if (!bullet.trim()) return;
    
    try {
      setLoadingIndex(index);
      const enhanced = await enhanceBullet(bullet, targetRole);
      const newData = [...data];
      newData[index].description = enhanced;
      onChange(newData);
    } catch (err) {
      console.error(err);
      alert('Failed to enhance bullet point. Make sure GEMINI_API_KEY is configured.');
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Work Experience</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-700 rounded-xl">
          No experience added yet. Add your work history here.
        </div>
      ) : (
        <div className="space-y-8">
          {data.map((exp, index) => (
            <div key={index} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 relative">
              <button 
                onClick={() => handleRemove(index)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4">
                <div>
                  <label className="block text-slate-400 mb-1 text-sm font-medium">Company</label>
                  <input type="text" name="company" value={exp.company || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-sm font-medium">Role / Title</label>
                  <input type="text" name="role" value={exp.role || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Frontend Developer" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-sm font-medium">Location</label>
                  <input type="text" name="location" value={exp.location || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Mountain View, CA" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1 text-sm font-medium">Start Date</label>
                    <input type="text" name="startDate" value={exp.startDate || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Jun 2020" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 text-sm font-medium">End Date</label>
                    <input type="text" name="endDate" value={exp.endDate || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Present" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-400 text-sm font-medium">Description / Responsibilities</label>
                  <button 
                    onClick={() => handleEnhance(index)}
                    disabled={loadingIndex === index || !exp.description}
                    className="flex items-center text-xs bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 hover:text-white px-2 py-1 rounded transition-colors disabled:opacity-50"
                  >
                    {loadingIndex === index ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
                    AI Enhance
                  </button>
                </div>
                <textarea 
                  name="description" 
                  value={exp.description || ''} 
                  onChange={(e) => handleChange(index, e)} 
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" 
                  placeholder="e.g. Built login page. Tip: Write something simple, then click 'AI Enhance'!" 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
