import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getWisdomBooks, createWisdomBook, updateWisdomBook, deleteWisdomBook } from '../../api/wisdom';
import { Plus, Edit, Trash2, Save, X, BookOpen } from 'lucide-react';

const AdminWisdomLibrary = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingBook, setEditingBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBooks = async () => {
    if (user?.token) {
      try {
        const data = await getWisdomBooks(user.token);
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);

  const handleCreateNew = () => {
    setEditingBook({
      title: { en: '', ta: '' },
      author: { en: '', ta: '' },
      coverImage: '',
      overview: { en: '', ta: '' },
      topQuotes: [{ en: '', ta: '' }, { en: '', ta: '' }, { en: '', ta: '' }],
      lessons: Array.from({ length: 20 }, (_, i) => ({
        lessonNumber: i + 1,
        title: { en: '', ta: '' },
        explanation: { en: '', ta: '' },
        whyItMatters: { en: '', ta: '' },
        example: { en: '', ta: '' },
        actionStep: { en: '', ta: '' },
        reflectionQuestion: { en: '', ta: '' },
      }))
    });
    setIsModalOpen(true);
  };

  const handleEdit = async (book: any) => {
    // The list API doesn't return full lessons, we need to fetch the full book by ID if needed, 
    // but for admin, it's better if we just use the getBookById API when editing, or update the list API to return all for admin.
    // Assuming we can fetch the full book data:
    if (user?.token) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wisdom/books/${book._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const fullBook = await res.json();
        setEditingBook(fullBook);
        setIsModalOpen(true);
      } catch (err) {
        console.error("Failed to fetch full book", err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      if (user?.token) {
        try {
          await deleteWisdomBook(id, user.token);
          fetchBooks();
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.token && editingBook) {
      try {
        if (editingBook._id) {
          await updateWisdomBook(editingBook._id, editingBook, user.token);
        } else {
          await createWisdomBook(editingBook, user.token);
        }
        setIsModalOpen(false);
        setEditingBook(null);
        fetchBooks();
      } catch (err) {
        console.error(err);
        alert("Error saving book.");
      }
    }
  };

  // Helper for deeply nested state updates
  const updateField = (path: string[], value: any) => {
    setEditingBook((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const updateLessonField = (lessonIndex: number, field: string, lang: 'en'|'ta', value: string) => {
    setEditingBook((prev: any) => {
      const newLessons = [...prev.lessons];
      newLessons[lessonIndex] = {
        ...newLessons[lessonIndex],
        [field]: { ...newLessons[lessonIndex][field], [lang]: value }
      };
      return { ...prev, lessons: newLessons };
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-amber-500" />
          Manage Wisdom Library
        </h2>
        <button 
          onClick={handleCreateNew}
          className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Book
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading books...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Title (EN)</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {books.map(book => (
                <tr key={book._id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-bold text-white">{book.title?.en}</td>
                  <td className="px-6 py-4 text-slate-300">{book.author?.en}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(book)} className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg mr-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(book._id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-500">No books found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-2xl sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">{editingBook._id ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* General Info */}
              <div className="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-lg font-bold text-amber-500">General Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Title (EN)</label>
                    <input required value={editingBook.title.en} onChange={e => updateField(['title', 'en'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Title (TA)</label>
                    <input required value={editingBook.title.ta} onChange={e => updateField(['title', 'ta'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Author (EN)</label>
                    <input required value={editingBook.author.en} onChange={e => updateField(['author', 'en'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Author (TA)</label>
                    <input required value={editingBook.author.ta} onChange={e => updateField(['author', 'ta'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-400 mb-1">Cover Image URL</label>
                    <input required value={editingBook.coverImage} onChange={e => updateField(['coverImage'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-400 mb-1">Overview (EN)</label>
                    <textarea required value={editingBook.overview.en} onChange={e => updateField(['overview', 'en'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white h-24" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-400 mb-1">Overview (TA)</label>
                    <textarea required value={editingBook.overview.ta} onChange={e => updateField(['overview', 'ta'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white h-24" />
                  </div>
                </div>
              </div>

              {/* Top Quotes */}
              <div className="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-lg font-bold text-amber-500">Top Quotes (3 required)</h4>
                {editingBook.topQuotes.map((q: any, i: number) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-700 pb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Quote {i+1} (EN)</label>
                      <textarea required value={q.en} onChange={e => updateField(['topQuotes', i.toString(), 'en'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Quote {i+1} (TA)</label>
                      <textarea required value={q.ta} onChange={e => updateField(['topQuotes', i.toString(), 'ta'], e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Lessons (20 required) */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-amber-500 sticky top-0 bg-slate-900 py-2 z-10">20 Lessons</h4>
                {editingBook.lessons.map((lesson: any, i: number) => (
                  <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                    <h5 className="font-bold text-white bg-slate-800 px-4 py-2 rounded-lg inline-block">Lesson {lesson.lessonNumber}</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* English Column */}
                      <div className="space-y-4">
                        <h6 className="text-center font-bold text-slate-400 bg-slate-900 py-1 rounded">ENGLISH</h6>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Title</label>
                          <input required value={lesson.title.en} onChange={e => updateLessonField(i, 'title', 'en', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Explanation</label>
                          <textarea required value={lesson.explanation.en} onChange={e => updateLessonField(i, 'explanation', 'en', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-20" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Why It Matters</label>
                          <textarea required value={lesson.whyItMatters.en} onChange={e => updateLessonField(i, 'whyItMatters', 'en', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-16" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Example</label>
                          <textarea required value={lesson.example.en} onChange={e => updateLessonField(i, 'example', 'en', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-16" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Action Step</label>
                          <textarea required value={lesson.actionStep.en} onChange={e => updateLessonField(i, 'actionStep', 'en', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-16" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Reflection Question</label>
                          <input required value={lesson.reflectionQuestion.en} onChange={e => updateLessonField(i, 'reflectionQuestion', 'en', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white" />
                        </div>
                      </div>

                      {/* Tamil Column */}
                      <div className="space-y-4">
                        <h6 className="text-center font-bold text-amber-500/70 bg-amber-500/10 py-1 rounded border border-amber-500/20">TAMIL</h6>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Title</label>
                          <input required value={lesson.title.ta} onChange={e => updateLessonField(i, 'title', 'ta', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Explanation</label>
                          <textarea required value={lesson.explanation.ta} onChange={e => updateLessonField(i, 'explanation', 'ta', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-20" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Why It Matters</label>
                          <textarea required value={lesson.whyItMatters.ta} onChange={e => updateLessonField(i, 'whyItMatters', 'ta', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-16" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Example</label>
                          <textarea required value={lesson.example.ta} onChange={e => updateLessonField(i, 'example', 'ta', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-16" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Action Step</label>
                          <textarea required value={lesson.actionStep.ta} onChange={e => updateLessonField(i, 'actionStep', 'ta', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white h-16" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Reflection Question</label>
                          <input required value={lesson.reflectionQuestion.ta} onChange={e => updateLessonField(i, 'reflectionQuestion', 'ta', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </form>
            <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl flex justify-end gap-4 sticky bottom-0 z-10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors">
                <Save className="w-5 h-5 mr-2" /> Save Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWisdomLibrary;
