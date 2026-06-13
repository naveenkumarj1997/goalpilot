import React, { useEffect, useState } from 'react';
import { getJournalEntries, addJournalEntry } from '../../api/nofap';
import { BookOpen, Plus, Send } from 'lucide-react';

export default function NoFapJournal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [mood, setMood] = useState('Good');
  const [energy, setEnergy] = useState('Medium');
  const [motivation, setMotivation] = useState('Medium');
  const [notes, setNotes] = useState('');

  const fetchEntries = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (token) {
        const data = await getJournalEntries(token);
        setEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch journal entries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      if (token) {
        await addJournalEntry({ mood, energy, motivation, notes }, token);
        setNotes('');
        setShowForm(false);
        fetchEntries(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to add entry', error);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-b-2 border-brand rounded-full"></div></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold text-text-primary">Discipline Journal</h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white transition-colors"
        >
          {showForm ? <span className="flex items-center">Cancel</span> : <span className="flex items-center"><Plus className="h-5 w-5 mr-1"/> New Entry</span>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl border border-brand/30 bg-gray-900/50 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Mood</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand">
                <option value="Great">Great</option>
                <option value="Good">Good</option>
                <option value="Neutral">Neutral</option>
                <option value="Bad">Bad</option>
                <option value="Terrible">Terrible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Energy</label>
              <select value={energy} onChange={(e) => setEnergy(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Motivation</label>
              <select value={motivation} onChange={(e) => setMotivation(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Reflections</label>
            <textarea 
              required
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand resize-none"
              placeholder="How are you feeling today? Any urges? What went well?"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="flex items-center px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors">
              <Send className="h-4 w-4 mr-2" /> Save Entry
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl border border-gray-800">
            <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No journal entries yet. Start reflecting on your journey.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className="glass p-6 rounded-2xl border border-emerald-100/10 hover:border-emerald-100/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-brand">
                  {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className="flex space-x-2 text-xs">
                  <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">Mood: {entry.mood}</span>
                  <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">Energy: {entry.energy}</span>
                </div>
              </div>
              <p className="text-gray-200 whitespace-pre-wrap">{entry.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
