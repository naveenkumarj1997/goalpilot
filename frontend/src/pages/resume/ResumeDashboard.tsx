import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Copy, Trash2, Edit2, Download, RefreshCw } from 'lucide-react';
import { getResumes, createResume, deleteResume, duplicateResume } from '../../services/resumeService';

export default function ResumeDashboard() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreate = async () => {
    try {
      const newResume = await createResume({ title: 'Untitled Resume' });
      navigate(`/resume/${newResume._id}/edit`);
    } catch (err) {
      console.error(err);
      alert('Failed to create resume');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateResume(id);
      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await deleteResume(id);
      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-white">
            <FileText className="w-8 h-8 mr-3 text-purple-500" /> AI Resume Builder
          </h1>
          <p className="text-slate-400 mt-2">Create, manage, and score your ATS-friendly resumes.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> New Resume
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-16 text-center border border-slate-700 shadow-xl">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Resumes Yet</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Create your first resume and let our AI help you craft the perfect professional summary and bullet points.</p>
          <button 
            onClick={handleCreate}
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
          >
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <div key={resume._id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-purple-500 transition-colors shadow-lg group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white truncate pr-4">{resume.title}</h3>
                {resume.atsScore > 0 && (
                  <div className={`px-2 py-1 rounded text-xs font-bold ${resume.atsScore >= 80 ? 'bg-green-500/20 text-green-400' : resume.atsScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    ATS: {resume.atsScore}
                  </div>
                )}
              </div>
              
              <p className="text-sm text-slate-400 mb-6">Target Role: {resume.targetRole || 'Not specified'}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/resume/${resume._id}/edit`)}
                    className="p-2 bg-slate-700 hover:bg-purple-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/resume/${resume._id}/preview`)}
                    className="p-2 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                    title="Preview & Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDuplicate(resume._id)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(resume._id)}
                    className="p-2 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
