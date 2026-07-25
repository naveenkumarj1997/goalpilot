import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotes, createNote, updateNote, deleteNote } from '../../api/astrologyNotes';
import type { AstrologyNote } from '../../api/astrologyNotes';
import { Plus, Edit2, Trash2, X, Save, Tag, Video, User, Search, BookOpen, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Add custom styles to override quill's default light theme
const quillStyles = `
  .quill-dark .ql-toolbar {
    border-color: rgba(217, 70, 239, 0.3);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    background-color: rgba(15, 23, 42, 0.5);
  }
  .quill-dark .ql-container {
    border-color: rgba(217, 70, 239, 0.3);
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    background-color: rgba(30, 41, 59, 0.5);
    color: white;
    font-size: 0.875rem;
    min-height: 12rem;
  }
  .quill-dark .ql-stroke { stroke: #94a3b8; }
  .quill-dark .ql-fill { fill: #94a3b8; }
  .quill-dark .ql-picker { color: #94a3b8; }
  .quill-dark .ql-picker-options { background-color: #1e293b; border-color: rgba(217, 70, 239, 0.3); }
  .quill-dark .ql-editor.ql-blank::before { color: #64748b; font-style: normal; }
`;

export default function AstrologyNotesTab() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<AstrologyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };

  // Table & Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // View State
  const [viewingNote, setViewingNote] = useState<AstrologyNote | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (isModalOpen || viewingNote) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, viewingNote]);

  const fetchNotes = async () => {
    if (!user?.token) return;
    try {
      setIsLoading(true);
      const data = await getNotes(user.token);
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch astrology notes', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (note?: AstrologyNote) => {
    setViewingNote(null);
    if (note) {
      setEditingId(note._id);
      setTitle(note.title);
      setContent(note.content);
      setTagsStr(note.tags.join(', '));
      setSource(note.source || '');
    } else {
      setEditingId(null);
      setTitle('');
      setContent('');
      setTagsStr('');
      setSource('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !title.trim() || !content.trim()) return;

    const tagsArray = tagsStr.split(',').map(t => t.trim()).filter(t => t);
    const noteData = { title, content, tags: tagsArray, source };

    try {
      if (editingId) {
        await updateNote(user.token, editingId, noteData);
      } else {
        await createNote(user.token, noteData);
      }
      await fetchNotes();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.token) return;
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(user.token, id);
        await fetchNotes();
      } catch (error) {
        console.error('Failed to delete note', error);
      }
    }
  };

  const handleSort = (field: 'title' | 'createdAt' | 'updatedAt') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter, Sort, and Paginate logic
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.max(1, Math.ceil(sortedNotes.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  // Ensure we don't end up on an empty page if we filter
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedNotes = sortedNotes.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);

  const SortIcon = ({ field }: { field: 'title' | 'createdAt' | 'updatedAt' }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-slate-600" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 text-fuchsia-400" /> : <ChevronDown className="w-4 h-4 text-fuchsia-400" />;
  };

  return (
    <div className="space-y-6">
      <style>{quillStyles}</style>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-fuchsia-500/20">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-fuchsia-400" />
            My Astrology Notes
          </h2>
          <p className="text-sm text-slate-400">Save insights, youtube learnings, and jathagam details.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="relative w-full sm:w-64 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-fuchsia-500/30 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-500"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-fuchsia-900/20 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900/40 border border-fuchsia-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fuchsia-900/10 border-b border-fuchsia-500/20">
                <th 
                  className="p-4 font-semibold text-sm text-fuchsia-200 cursor-pointer hover:bg-fuchsia-900/20 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">Title <SortIcon field="title" /></div>
                </th>
                <th className="p-4 font-semibold text-sm text-fuchsia-200">Source & Tags</th>
                <th 
                  className="p-4 font-semibold text-sm text-fuchsia-200 cursor-pointer hover:bg-fuchsia-900/20 transition-colors hidden sm:table-cell"
                  onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center gap-2">Last Updated <SortIcon field="updatedAt" /></div>
                </th>
                <th className="p-4 font-semibold text-sm text-fuchsia-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-500 mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedNotes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No notes found.
                  </td>
                </tr>
              ) : (
                paginatedNotes.map(note => (
                  <tr 
                    key={note._id} 
                    className="border-b border-fuchsia-500/10 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => setViewingNote(note)}
                  >
                    <td className="p-4">
                      <div className="font-medium text-slate-200 line-clamp-1">{note.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-1 sm:hidden">{new Date(note.updatedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {note.source && (
                          <div className="flex items-center gap-1.5 text-xs text-fuchsia-300/70 w-fit">
                            {note.source.toLowerCase().includes('youtube') ? <Video className="w-3.5 h-3.5 flex-shrink-0" /> : <User className="w-3.5 h-3.5 flex-shrink-0" />}
                            <span className="truncate max-w-[150px]">{note.source}</span>
                          </div>
                        )}
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                {tag}
                              </span>
                            ))}
                            {note.tags.length > 3 && <span className="text-[10px] text-slate-500">+{note.tags.length - 3}</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400 hidden sm:table-cell">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setViewingNote(note); }} 
                          className="text-slate-400 hover:text-blue-400 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(note); }} 
                          className="text-slate-400 hover:text-fuchsia-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(note._id, e)} 
                          className="text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && sortedNotes.length > 0 && (
          <div className="p-4 border-t border-fuchsia-500/20 bg-slate-900/60 flex items-center justify-between text-sm">
            <div className="text-slate-400">
              Showing <span className="text-white font-medium">{(validCurrentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(validCurrentPage * itemsPerPage, sortedNotes.length)}</span> of <span className="text-white font-medium">{sortedNotes.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit / Create Form Modal */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCloseModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-fuchsia-500/30 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-fuchsia-500/20 flex justify-between items-center bg-fuchsia-900/10 flex-shrink-0">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {editingId ? <Edit2 className="w-5 h-5 text-fuchsia-400" /> : <Plus className="w-5 h-5 text-fuchsia-400" />}
                    {editingId ? 'Edit Note' : 'New Astrology Note'}
                  </h3>
                  <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Saturn Transit 2024 Effects"
                      className="w-full bg-slate-800/50 border border-fuchsia-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Notes</label>
                    <div className="quill-dark">
                      <ReactQuill 
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        placeholder="Write down your insights, predictions, or remedies..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={tagsStr}
                        onChange={(e) => setTagsStr(e.target.value)}
                        placeholder="e.g. transit, remedy, jathagam"
                        className="w-full bg-slate-800/50 border border-fuchsia-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Source (Optional)</label>
                      <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g. YouTube Video Link, Astrologer Name"
                        className="w-full bg-slate-800/50 border border-fuchsia-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-fuchsia-500/10">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-fuchsia-900/20"
                    >
                      <Save className="w-4 h-4" /> {editingId ? 'Update Note' : 'Save Note'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* View Note Modal */}
      {createPortal(
        <AnimatePresence>
          {viewingNote && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setViewingNote(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-900/10 flex-shrink-0">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    {viewingNote.title}
                  </h3>
                  <button type="button" onClick={() => setViewingNote(null)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                  {/* Content */}
                  <div 
                    className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: viewingNote.content }}
                  />
                  
                  {/* Metadata */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    {viewingNote.source && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="text-slate-500 font-medium">Source:</span>
                        <div className="flex items-center gap-1.5 text-fuchsia-300/90 bg-fuchsia-900/20 px-2 py-1 rounded w-fit">
                          {viewingNote.source.toLowerCase().includes('youtube') ? <Video className="w-4 h-4 flex-shrink-0" /> : <User className="w-4 h-4 flex-shrink-0" />}
                          <span className="break-all">{viewingNote.source}</span>
                        </div>
                      </div>
                    )}

                    {viewingNote.tags.length > 0 && (
                      <div className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-slate-500 font-medium mt-1">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {viewingNote.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-[11px] uppercase font-bold text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/20">
                              <Tag className="w-3 h-3" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                      <span>Created: {new Date(viewingNote.createdAt).toLocaleString()}</span>
                      <span>Updated: {new Date(viewingNote.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-emerald-500/10 flex justify-end gap-3 bg-slate-900/50 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const note = viewingNote;
                      setViewingNote(null);
                      handleOpenModal(note);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-400/10 hover:bg-fuchsia-400/20 rounded-lg transition-colors border border-fuchsia-400/20"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingNote(null)}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
