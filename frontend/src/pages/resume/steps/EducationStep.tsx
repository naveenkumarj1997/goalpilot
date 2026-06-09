import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function EducationStep({ data, onChange }: { data: any[], onChange: (data: any[]) => void }) {
  const handleAdd = () => {
    onChange([...data, { degree: '', school: '', startDate: '', endDate: '', cgpa: '' }]);
  };

  const handleRemove = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[index][e.target.name] = e.target.value;
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Education</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-700 rounded-xl">
          No education added yet. Click the button above to add your degrees.
        </div>
      ) : (
        <div className="space-y-8">
          {data.map((edu, index) => (
            <div key={index} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 relative">
              <button 
                onClick={() => handleRemove(index)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 text-sm font-medium">Degree / Qualification</label>
                  <input type="text" name="degree" value={edu.degree || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. B.S. in Computer Science" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 text-sm font-medium">University / College</label>
                  <input type="text" name="school" value={edu.school || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. MIT" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-sm font-medium">Start Date</label>
                  <input type="text" name="startDate" value={edu.startDate || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. Aug 2018" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 text-sm font-medium">End Date</label>
                  <input type="text" name="endDate" value={edu.endDate || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. May 2022 (or Present)" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 text-sm font-medium">CGPA / Grade (Optional)</label>
                  <input type="text" name="cgpa" value={edu.cgpa || ''} onChange={(e) => handleChange(index, e)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="e.g. 3.8/4.0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
