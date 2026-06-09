import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Loader2, X } from 'lucide-react';
import { categorizeSkills } from '../../../services/resumeService';

export default function SkillsStep({ data, onChange }: { data: any[], onChange: (data: any[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [rawInput, setRawInput] = useState('');

  const handleCategorize = async () => {
    if (!rawInput.trim()) return;
    try {
      setLoading(true);
      const categorized = await categorizeSkills(rawInput);
      
      // Merge with existing data
      let newData = [...data];
      categorized.forEach((cat: any) => {
        const existingCat = newData.find(c => c.category === cat.category);
        if (existingCat) {
          existingCat.items = Array.from(new Set([...existingCat.items, ...cat.items]));
        } else {
          newData.push(cat);
        }
      });
      
      onChange(newData);
      setRawInput('');
    } catch (err) {
      console.error(err);
      alert('Failed to categorize skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    onChange([...data, { category: 'New Category', items: [] }]);
  };

  const handleRemoveCategory = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  const handleCategoryNameChange = (index: number, name: string) => {
    const newData = [...data];
    newData[index].category = name;
    onChange(newData);
  };

  const handleRemoveItem = (catIndex: number, itemIndex: number) => {
    const newData = [...data];
    newData[catIndex].items.splice(itemIndex, 1);
    onChange(newData);
  };

  const handleAddItem = (catIndex: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newData = [...data];
      newData[catIndex].items.push(e.currentTarget.value.trim());
      onChange(newData);
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">Skills</h2>
      
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-indigo-300 mb-2 flex items-center">
          <Wand2 className="w-5 h-5 mr-2" /> AI Skill Categorization
        </h3>
        <p className="text-slate-400 text-sm mb-4">Paste a comma-separated list of your skills, and AI will automatically group them.</p>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCategorize()}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
            placeholder="React, Node.js, AWS, MongoDB, TypeScript, Docker..." 
          />
          <button 
            onClick={handleCategorize}
            disabled={loading || !rawInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Categorize'}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-200">Your Skill Groups</h3>
        <button 
          onClick={handleAddCategory}
          className="flex items-center text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Group
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-slate-500 italic">
          No skills added yet. Use the AI tool above or add a group manually.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((cat, catIndex) => (
            <div key={catIndex} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 relative group">
              <button 
                onClick={() => handleRemoveCategory(catIndex)}
                className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Remove Group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <input 
                type="text" 
                value={cat.category}
                onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-purple-500 text-lg font-bold text-white focus:outline-none px-1 py-1 transition-colors w-[85%] mb-4"
              />
              
              <div className="flex flex-wrap gap-2 mb-4">
                {cat.items.map((item: string, itemIndex: number) => (
                  <div key={itemIndex} className="bg-slate-800 border border-slate-600 rounded-full px-3 py-1 flex items-center text-sm text-slate-300">
                    {item}
                    <button onClick={() => handleRemoveItem(catIndex, itemIndex)} className="ml-2 text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <input 
                type="text" 
                placeholder="Type skill & press Enter..." 
                onKeyDown={(e) => handleAddItem(catIndex, e)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
