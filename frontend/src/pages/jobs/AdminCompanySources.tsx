import { useState, useEffect, useMemo } from 'react';
import jobService from '../../services/jobService';
import { Database, Plus, Trash2, PlayCircle, Search, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export default function AdminCompanySources() {
  const [sources, setSources] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  
  const [newSource, setNewSource] = useState({ name: '', careerUrl: '', scraperType: 'playwright' });
  const [newKeyword, setNewKeyword] = useState('');
  const [scanning, setScanning] = useState(false);

  // Search & Sort states
  const [searchSource, setSearchSource] = useState('');
  const [searchKeywordStr, setSearchKeywordStr] = useState('');

  // Pagination states
  const [sourcePage, setSourcePage] = useState(1);
  const [keywordPage, setKeywordPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const [sData, kData] = await Promise.all([
        jobService.getSources(),
        jobService.getKeywords()
      ]);
      setSources(sData);
      setKeywords(kData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await jobService.addSource(newSource);
      setNewSource({ name: '', careerUrl: '', scraperType: 'playwright' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSource = async (id: string) => {
    if (window.confirm('Remove this company source?')) {
      try {
        await jobService.removeSource(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    try {
      await jobService.addKeyword({ keyword: newKeyword });
      setNewKeyword('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveKeyword = async (id: string) => {
    if (window.confirm('Remove this keyword?')) {
      try {
        await jobService.removeKeyword(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTriggerScan = async () => {
    setScanning(true);
    try {
      await jobService.triggerScan();
      alert('Background scan triggered successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to trigger scan');
    } finally {
      setTimeout(() => setScanning(false), 2000);
    }
  };

  // --- Process Data ---
  const filteredSources = useMemo(() => {
    return sources
      .filter(s => s.name.toLowerCase().includes(searchSource.toLowerCase()) || s.careerUrl.toLowerCase().includes(searchSource.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sources, searchSource]);

  const sourceTotalPages = Math.max(1, Math.ceil(filteredSources.length / itemsPerPage));
  const paginatedSources = filteredSources.slice((sourcePage - 1) * itemsPerPage, sourcePage * itemsPerPage);

  const filteredKeywords = useMemo(() => {
    return keywords
      .filter(k => k.keyword.toLowerCase().includes(searchKeywordStr.toLowerCase()))
      .sort((a, b) => a.keyword.localeCompare(b.keyword));
  }, [keywords, searchKeywordStr]);

  const keywordTotalPages = Math.max(1, Math.ceil(filteredKeywords.length / itemsPerPage));
  const paginatedKeywords = filteredKeywords.slice((keywordPage - 1) * itemsPerPage, keywordPage * itemsPerPage);

  // Pagination fix if search reduces results below current page
  useEffect(() => { if (sourcePage > sourceTotalPages) setSourcePage(1); }, [sourceTotalPages]);
  useEffect(() => { if (keywordPage > keywordTotalPages) setKeywordPage(1); }, [keywordTotalPages]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center text-white">
            <Database className="w-8 h-8 mr-3 text-red-500" /> Admin Scraper Config
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Manage the targeted companies and job keywords for the background scanner.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- LEFT: TARGET COMPANIES --- */}
        <div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6 shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center"><Database className="w-5 h-5 mr-2 text-blue-400"/> Add Target Company</h3>
            <form onSubmit={handleAddSource} className="flex flex-col gap-4">
              <input 
                type="text" required placeholder="Company Name (e.g. TCS)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                value={newSource.name} onChange={e => setNewSource({...newSource, name: e.target.value})}
              />
              <input 
                type="url" required placeholder="Career Page URL"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                value={newSource.careerUrl} onChange={e => setNewSource({...newSource, careerUrl: e.target.value})}
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center w-full">
                <Plus className="w-4 h-4 mr-1" /> Add Company
              </button>
            </form>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-800/50">
              <h3 className="font-bold">Target Companies</h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input 
                  type="text" placeholder="Search..."
                  className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-lg sm:rounded-full pl-9 pr-4 py-1.5 text-sm text-white"
                  value={searchSource} onChange={e => setSearchSource(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700 text-xs uppercase text-slate-400">
                    <th className="p-4 font-bold">Company</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSources.map(source => (
                    <tr key={source._id} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition-colors text-sm">
                      <td className="p-4">
                        <div className="font-bold text-white">{source.name}</div>
                        <a href={source.careerUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline break-all">{source.careerUrl}</a>
                      </td>
                      <td className="p-4 text-xs">
                        <span className={`px-2 py-1 rounded border ${source.lastStatus?.startsWith('Success') ? 'bg-green-500/20 text-green-400 border-green-500/50' : source.lastStatus?.startsWith('Failed') ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                          {source.lastStatus ? source.lastStatus.substring(0, 20) + (source.lastStatus.length > 20 ? '...' : '') : 'Never scanned'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleRemoveSource(source._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedSources.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-500 italic">No companies found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {sourceTotalPages > 1 && (
              <div className="p-4 border-t border-slate-700 flex items-center justify-between bg-slate-900/30">
                <button onClick={() => setSourcePage(p => Math.max(1, p - 1))} disabled={sourcePage === 1} className="p-1 rounded hover:bg-slate-700 disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                <span className="text-sm text-slate-400">Page {sourcePage} of {sourceTotalPages}</span>
                <button onClick={() => setSourcePage(p => Math.min(sourceTotalPages, p + 1))} disabled={sourcePage === sourceTotalPages} className="p-1 rounded hover:bg-slate-700 disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: KEYWORDS --- */}
        <div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6 shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center"><Tag className="w-5 h-5 mr-2 text-purple-400"/> Add Job Keyword</h3>
            <form onSubmit={handleAddKeyword} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" required placeholder="e.g. React Developer"
                className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
              />
              <button type="submit" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center">
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </form>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-800/50">
              <h3 className="font-bold">Active Keywords</h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input 
                  type="text" placeholder="Search..."
                  className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-lg sm:rounded-full pl-9 pr-4 py-1.5 text-sm text-white"
                  value={searchKeywordStr} onChange={e => setSearchKeywordStr(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700 text-xs uppercase text-slate-400">
                    <th className="p-4 font-bold">Keyword</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedKeywords.map(k => (
                    <tr key={k._id} className="border-b border-slate-700/50 hover:bg-slate-800/80 transition-colors text-sm">
                      <td className="p-4 font-bold text-white flex items-center">
                        <Tag className="w-3 h-3 mr-2 text-purple-500" /> {k.keyword}
                      </td>
                      <td className="p-4 text-xs">
                        <span className="px-2 py-1 rounded border bg-green-500/20 text-green-400 border-green-500/50">Active</span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleRemoveKeyword(k._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedKeywords.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-500 italic">No keywords found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {keywordTotalPages > 1 && (
              <div className="p-4 border-t border-slate-700 flex items-center justify-between bg-slate-900/30">
                <button onClick={() => setKeywordPage(p => Math.max(1, p - 1))} disabled={keywordPage === 1} className="p-1 rounded hover:bg-slate-700 disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                <span className="text-sm text-slate-400">Page {keywordPage} of {keywordTotalPages}</span>
                <button onClick={() => setKeywordPage(p => Math.min(keywordTotalPages, p + 1))} disabled={keywordPage === keywordTotalPages} className="p-1 rounded hover:bg-slate-700 disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
