import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import { Database, Plus, Trash2, PlayCircle } from 'lucide-react';

export default function AdminCompanySources() {
  const [sources, setSources] = useState<any[]>([]);
  const [newSource, setNewSource] = useState({ name: '', careerUrl: '', scraperType: 'playwright' });
  const [scanning, setScanning] = useState(false);

  const fetchSources = async () => {
    try {
      const data = await jobService.getSources();
      setSources(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await jobService.addSource(newSource);
      setNewSource({ name: '', careerUrl: '', scraperType: 'playwright' });
      fetchSources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id: string) => {
    if (window.confirm('Remove this company source?')) {
      try {
        await jobService.removeSource(id);
        fetchSources();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTriggerScan = async () => {
    setScanning(true);
    try {
      await jobService.triggerScan();
      alert('Background scan triggered successfully! Check logs later.');
    } catch (err) {
      console.error(err);
      alert('Failed to trigger scan');
    } finally {
      setTimeout(() => setScanning(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center text-white"><Database className="w-8 h-8 mr-3 text-red-500" /> Admin Targets</h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Manage the career pages the live search engine targets.</p>
        </div>
        <button 
          onClick={handleTriggerScan}
          disabled={scanning}
          className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg font-bold transition-all ${
            scanning ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
          }`}
        >
          <PlayCircle className={`w-5 h-5 mr-2 ${scanning ? 'animate-pulse' : ''}`} />
          {scanning ? 'Triggering...' : 'Trigger Manual Scan'}
        </button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 shadow-xl">
        <h3 className="font-bold text-lg mb-4">Add New Target</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            required
            className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
            placeholder="Company Name (e.g. TCS)"
            value={newSource.name}
            onChange={e => setNewSource({...newSource, name: e.target.value})}
          />
          <input 
            type="url" 
            required
            className="flex-2 w-full sm:w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
            placeholder="Career URL"
            value={newSource.careerUrl}
            onChange={e => setNewSource({...newSource, careerUrl: e.target.value})}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-1" /> Add
          </button>
        </form>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-sm uppercase text-slate-400">
              <th className="p-4 font-bold">Company</th>
              <th className="p-4 font-bold">Target URL</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Last Scanned</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map(source => (
              <tr key={source._id} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                <td className="p-4 font-bold text-white">{source.name}</td>
                <td className="p-4 text-sm text-blue-400"><a href={source.careerUrl} target="_blank" rel="noreferrer" className="hover:underline">{source.careerUrl}</a></td>
                <td className="p-4 text-xs text-slate-300">
                  <span className={`px-2 py-1 rounded border ${source.lastStatus?.startsWith('Success') ? 'bg-green-500/20 text-green-400 border-green-500/50' : source.lastStatus?.startsWith('Failed') ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                    {source.lastStatus || 'Never scanned'}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-400">{source.lastScannedAt ? new Date(source.lastScannedAt).toLocaleString() : 'N/A'}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleRemove(source._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {sources.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">No targets added.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
