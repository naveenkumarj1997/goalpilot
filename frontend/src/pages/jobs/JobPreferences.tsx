import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import { Settings2, Save } from 'lucide-react';

export default function JobPreferences() {
  const [prefs, setPrefs] = useState({
    titles: '',
    locations: '',
    experiences: '',
    emailAlerts: false,
    telegramAlerts: false,
    telegramChatId: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      const data = await jobService.getPreferences();
      if (data) {
        setPrefs({
          titles: data.titles?.join(', ') || '',
          locations: data.locations?.join(', ') || '',
          experiences: data.experiences?.join(', ') || '',
          emailAlerts: data.emailAlerts || false,
          telegramAlerts: data.telegramAlerts || false,
          telegramChatId: data.telegramChatId || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await jobService.updatePreferences({
        titles: prefs.titles.split(',').map(s => s.trim()).filter(Boolean),
        locations: prefs.locations.split(',').map(s => s.trim()).filter(Boolean),
        experiences: prefs.experiences.split(',').map(s => s.trim()).filter(Boolean),
        emailAlerts: prefs.emailAlerts,
        telegramAlerts: prefs.telegramAlerts,
        telegramChatId: prefs.telegramChatId
      });
      alert('Preferences saved successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center text-white"><Settings2 className="w-8 h-8 mr-3 text-blue-500" /> Discovery Preferences</h1>
        <p className="text-slate-400 mt-2">Tell the engine what kind of jobs to look for.</p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl space-y-6">
        
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Job Titles (Comma Separated)</label>
          <input 
            type="text" 
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none" 
            placeholder="e.g. MERN Stack Developer, React Developer, Full Stack Engineer"
            value={prefs.titles}
            onChange={e => setPrefs({...prefs, titles: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Locations (Comma Separated)</label>
          <input 
            type="text" 
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none" 
            placeholder="e.g. Chennai, Bangalore, Remote"
            value={prefs.locations}
            onChange={e => setPrefs({...prefs, locations: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Experience Levels (Comma Separated)</label>
          <input 
            type="text" 
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none" 
            placeholder="e.g. Fresher, 1 Year, 2 Years"
            value={prefs.experiences}
            onChange={e => setPrefs({...prefs, experiences: e.target.value})}
          />
        </div>

        <hr className="border-slate-700" />

        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white">Alert Settings</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
              checked={prefs.emailAlerts}
              onChange={e => setPrefs({...prefs, emailAlerts: e.target.checked})}
            />
            <span className="text-slate-300 font-medium">Send me Email Alerts for new matches</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
              checked={prefs.telegramAlerts}
              onChange={e => setPrefs({...prefs, telegramAlerts: e.target.checked})}
            />
            <span className="text-slate-300 font-medium">Send me Telegram Alerts</span>
          </label>

          {prefs.telegramAlerts && (
            <div className="pl-8 pt-2">
              <label className="block text-sm font-bold text-slate-400 mb-2">Telegram Chat ID</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none" 
                placeholder="e.g. 123456789"
                value={prefs.telegramChatId}
                onChange={e => setPrefs({...prefs, telegramChatId: e.target.value})}
              />
            </div>
          )}
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center"
          >
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Preferences</>}
          </button>
        </div>
      </form>
    </div>
  );
}
