import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import goalService from '../../services/goalService';
import type { GoalFormData } from '../../types/goal';
import { ArrowLeft } from 'lucide-react';

export default function EditGoal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    description: '',
    deadline: '',
    totalRequiredHours: 0,
    completedHours: 0,
    priority: 'Medium',
    dailyAvailableHours: 0,
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGoal(id);
    }
  }, [id]);

  const fetchGoal = async (goalId: string) => {
    try {
      const goal = await goalService.getGoal(goalId);
      setFormData({
        name: goal.name,
        description: goal.description || '',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        totalRequiredHours: goal.totalRequiredHours || 0,
        completedHours: goal.completedHours || 0,
        priority: goal.priority,
        dailyAvailableHours: goal.dailyAvailableHours || 0,
        category: goal.category || '',
      });
    } catch (err) {
      console.error('Failed to fetch goal', err);
      setError('Could not load goal details');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setError('');
    setLoading(true);

    try {
      await goalService.updateGoal(id, {
        ...formData,
        totalRequiredHours: formData.totalRequiredHours ? Number(formData.totalRequiredHours) : undefined,
        completedHours: formData.completedHours ? Number(formData.completedHours) : undefined,
        dailyAvailableHours: formData.dailyAvailableHours ? Number(formData.dailyAvailableHours) : undefined,
      });
      navigate('/goals');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link to="/goals" className="text-gray-500 hover:text-text-primary mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Edit Goal</h1>
      </div>

      <div className="glass border border-emerald-100 rounded-2xl shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-full mix-blend-multiply opacity-50 blur-2xl -z-10" />
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-text-primary mb-1">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="totalRequiredHours" className="block text-sm font-medium text-text-primary mb-1">
                Total Required Hours
              </label>
              <input
                type="number"
                id="totalRequiredHours"
                name="totalRequiredHours"
                min="0"
                step="0.5"
                value={formData.totalRequiredHours || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="completedHours" className="block text-sm font-medium text-text-primary mb-1">
                Completed Hours
              </label>
              <input
                type="number"
                id="completedHours"
                name="completedHours"
                min="0"
                step="0.5"
                value={formData.completedHours || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="dailyAvailableHours" className="block text-sm font-medium text-text-primary mb-1">
                Daily Available Hours
              </label>
              <input
                type="number"
                id="dailyAvailableHours"
                name="dailyAvailableHours"
                min="0"
                max="24"
                step="0.5"
                value={formData.dailyAvailableHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Link
              to="/goals"
              className="px-6 py-2 text-text-secondary hover:text-text-primary font-medium transition-colors mr-4"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 btn-primary rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
