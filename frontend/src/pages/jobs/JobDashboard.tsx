import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import { Briefcase, Building2, MapPin, Clock, ExternalLink, BookmarkPlus, Zap, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JobDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filters, setFilters] = useState({ title: '', location: '', company: '' });
  const [loading, setLoading] = useState(true);
  
  // New States for Pagination and Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const JOBS_PER_PAGE = 5;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs(filters);
      setJobs(data);
      setCurrentPage(1); // Reset to first page on new search
      if (window.innerWidth < 1024) {
        setShowMobileFilters(false); // Close mobile filters after search
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = async (jobId: string) => {
    try {
      await jobService.updateUserJobState(jobId, 'saved');
      alert('Job Saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const isNewJob = (dateStr: string) => {
    const hoursDiff = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  // Sort and Paginate Logic
  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = new Date(a.discoveredAt).getTime();
    const dateB = new Date(b.discoveredAt).getTime();
    if (sortBy === 'newest') return dateB - dateA;
    if (sortBy === 'oldest') return dateA - dateB;
    return 0;
  });

  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
  const currentJobs = sortedJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white"><Briefcase className="w-8 h-8 mr-3 text-blue-500" /> Job Discovery</h1>
          <p className="text-slate-400 mt-2">Discover matching jobs scraped automatically from top company portals.</p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:bg-slate-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showMobileFilters ? 'Hide Search & Sort' : 'Search & Sort'}
          {showMobileFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-slate-800 rounded-xl p-6 sticky top-8 border border-slate-700 shadow-xl lg:shadow-none">
            <h3 className="font-bold text-lg mb-4 text-white flex items-center"><Filter className="w-5 h-5 mr-2 text-blue-400"/> Search & Sort</h3>
            <div className="space-y-4">
              {/* Sort Options */}
              <div className="mb-6 pb-6 border-b border-slate-700">
                <label className="block text-sm font-medium text-slate-400 mb-2">Sort By Date</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors" 
                  placeholder="e.g. React"
                  value={filters.title}
                  onChange={e => setFilters({...filters, title: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors" 
                  placeholder="e.g. TCS"
                  value={filters.company}
                  onChange={e => setFilters({...filters, company: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors" 
                  placeholder="e.g. Remote"
                  value={filters.location}
                  onChange={e => setFilters({...filters, location: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                />
              </div>
              <button 
                onClick={fetchJobs}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] mt-4"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Feed */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400">Loading your matches...</p>
            </div>
          ) : currentJobs.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-10 text-center border border-slate-700 shadow-lg">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Jobs Found</h3>
              <p className="text-slate-400">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm text-slate-400 px-2">
                <span>Showing {((currentPage - 1) * JOBS_PER_PAGE) + 1}-{Math.min(currentPage * JOBS_PER_PAGE, sortedJobs.length)} of {sortedJobs.length} jobs</span>
              </div>
              
              {currentJobs.map(job => {
                const isNew = isNewJob(job.discoveredAt);
                return (
                  <div key={job._id} className="bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] relative overflow-hidden group">
                    {isNew && (
                      <div className="absolute top-4 right-4 flex items-center bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border border-green-500/30">
                        <Zap className="w-3 h-3 mr-1" /> NEW
                      </div>
                    )}
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-2 pr-24 sm:pr-32 group-hover:text-blue-400 transition-colors">{job.title}</h2>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-400 mb-5">
                      <div className="flex items-center"><Building2 className="w-4 h-4 mr-1.5 text-slate-500" /> {job.company}</div>
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-slate-500" /> {job.location}</div>
                      <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-slate-500" /> {job.experience}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <a 
                        href={job.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center text-sm"
                      >
                        Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                      <button 
                        onClick={() => handleSaveJob(job._id)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center text-sm"
                      >
                        <BookmarkPlus className="w-4 h-4 mr-2 sm:mr-0" />
                        <span className="sm:hidden">Save Job</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center bg-slate-800 border border-slate-700 p-4 rounded-xl mt-6">
                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </button>
                  <span className="text-sm font-medium text-slate-400">
                    Page <span className="text-white">{currentPage}</span> of {totalPages}
                  </span>
                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
