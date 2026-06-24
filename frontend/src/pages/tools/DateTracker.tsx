import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, Plus, Clock, CalendarDays, Search, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface SavedDate {
  _id: string;
  title: string;
  targetDate: string;
  type: 'Age' | 'Event';
  createdAt?: string;
}

const DateTracker: React.FC = () => {
  const { user } = useAuth();
  const [dates, setDates] = useState<SavedDate[]>([]);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [type, setType] = useState<'Age' | 'Event'>('Age');
  const [loading, setLoading] = useState(false);

  // Table state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'title' | 'targetDate'>('targetDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get(`${API_URL}/dates`, config);
      setDates(data);
    } catch (err) {
      console.error('Failed to fetch dates', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      await axios.post(`${API_URL}/dates`, { title, targetDate, type }, config);
      setTitle('');
      setTargetDate('');
      fetchDates();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save date');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this track?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      await axios.delete(`${API_URL}/dates/${id}`, config);
      fetchDates();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const calculateTimeDiff = (startDate: Date, endDate: Date) => {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    return { years, months, days };
  };

  const calculateAgeMath = (birthDateStr: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    
    const diff = calculateTimeDiff(birthDate, today);

    // Days until next birthday
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntil = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return { years: diff.years, months: diff.months, days: diff.days, daysUntil };
  };

  const calculateEventMath = (eventDateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const eventDate = new Date(eventDateStr);
    eventDate.setHours(0,0,0,0);
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isFuture = diffDaysTotal > 0;
    const isToday = diffDaysTotal === 0;

    let diff;
    if (isFuture) {
      diff = calculateTimeDiff(today, eventDate);
    } else if (!isToday) {
      diff = calculateTimeDiff(eventDate, today);
    } else {
      diff = { years: 0, months: 0, days: 0 };
    }

    return { 
      years: diff.years, 
      months: diff.months, 
      days: diff.days, 
      diffDaysTotal: Math.abs(diffDaysTotal), 
      isFuture, 
      isToday 
    };
  };

  const handleSort = (field: 'title' | 'targetDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and Sort logic
  const filteredAndSortedDates = useMemo(() => {
    let result = dates.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result = result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'targetDate') {
        aVal = new Date(a.targetDate).getTime();
        bVal = new Date(b.targetDate).getTime();
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [dates, searchQuery, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedDates.length / itemsPerPage);
  const currentDates = filteredAndSortedDates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ field }: { field: 'title' | 'targetDate' }) => {
    if (sortField !== field) return <div className="w-4 h-4 ml-1 opacity-20"><ChevronUp /></div>;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl border border-brand/20">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <CalendarDays className="mr-3 text-brand" />
          Date & Age Tracker
        </h2>
        <p className="text-slate-400 text-sm mb-6">Track important dates and ages. Calculated live every day.</p>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider">Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as 'Age' | 'Event')}
              className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
            >
              <option value="Age">Age Calculator</option>
              <option value="Event">Event Calculator</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider">
              {type === 'Age' ? "Person's Name" : "Event Title"}
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'Age' ? "E.g., John Doe" : "E.g., Vacation"}
              className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs text-emerald-400 mb-1 font-semibold uppercase tracking-wider">
              {type === 'Age' ? "Date of Birth" : "Event Date"}
            </label>
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
              required
            />
          </div>
          <div className="md:col-span-1 flex items-end">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Save to Tracker
            </button>
          </div>
        </form>
      </div>

      <div className="glass p-6 rounded-2xl border border-brand/20 overflow-hidden flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-white">Your Tracked Dates</h3>
          <div className="relative w-full md:w-64">
            <input 
              type="text"
              placeholder="Search dates..."
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
              className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
        
        {dates.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No dates tracked yet. Add one above!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-emerald-500/20 text-xs uppercase tracking-wider text-emerald-400">
                    <th 
                      className="p-3 cursor-pointer hover:bg-slate-800/30 transition-colors group"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">Title <SortIcon field="title" /></div>
                    </th>
                    <th 
                      className="p-3 cursor-pointer hover:bg-slate-800/30 transition-colors group"
                      onClick={() => handleSort('targetDate')}
                    >
                      <div className="flex items-center">Date <SortIcon field="targetDate" /></div>
                    </th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Live Math</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400">No dates match your search.</td>
                    </tr>
                  ) : (
                    currentDates.map((date) => {
                      let mathDisplay;
                      let secondaryDisplay;
                      
                      if (date.type === 'Age') {
                        const math = calculateAgeMath(date.targetDate);
                        mathDisplay = <span className="text-brand font-bold">{math.years}y {math.months}m {math.days}d</span>;
                        secondaryDisplay = `${math.daysUntil} days to next birthday`;
                      } else {
                        const math = calculateEventMath(date.targetDate);
                        const durationStr = `${math.years > 0 ? `${math.years}y ` : ''}${math.months > 0 || math.years > 0 ? `${math.months}m ` : ''}${math.days}d`;
                        
                        if (math.isToday) {
                          mathDisplay = <span className="text-yellow-400 font-bold">TODAY!</span>;
                          secondaryDisplay = 'It is happening right now!';
                        } else if (math.isFuture) {
                          mathDisplay = <span className="text-emerald-400 font-bold">{durationStr} remaining</span>;
                          secondaryDisplay = `${math.diffDaysTotal} total days away`;
                        } else {
                          mathDisplay = <span className="text-slate-300 font-bold">{durationStr} passed</span>;
                          secondaryDisplay = `${math.diffDaysTotal} total days ago`;
                        }
                      }

                      return (
                        <tr key={date._id} className="border-b border-emerald-500/10 hover:bg-slate-800/30 transition-colors">
                          <td className="p-3 text-white font-medium">{date.title}</td>
                          <td className="p-3 text-slate-300">{new Date(date.targetDate).toLocaleDateString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              date.type === 'Age' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {date.type}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              {mathDisplay}
                              <span className="text-[10px] text-slate-400 mt-0.5">{secondaryDisplay}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDelete(date._id)}
                              className="text-slate-500 hover:text-red-500 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-emerald-500/20">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-400 font-bold">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DateTracker;
