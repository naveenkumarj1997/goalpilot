import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import goalService from '../../services/goalService';
import type { Goal } from '../../types/goal';
import { calculateGoalTargets } from '../../utils/goalCalculator';
import { Plus, Edit2, Trash2, Calendar, Target as TargetIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GoalList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.deleteGoal(id);
        setGoals(goals.filter(g => g._id !== id));
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading goals...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">My Goals</h1>
        <Link
          to="/goals/create"
          className="flex items-center px-4 py-2 btn-primary rounded-xl transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Goal
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center border border-brand-light">
          <p className="text-text-secondary mb-4">You haven't created any goals yet.</p>
          <Link
            to="/goals/create"
            className="inline-flex items-center text-brand font-medium hover:underline"
          >
            Create your first goal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                delay: index * 0.1 
              }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="glass rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden flex flex-col border border-transparent hover:border-brand/30"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-brand transition-colors">{goal.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm
                      ${goal.priority === 'High' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                        goal.priority === 'Medium' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                        'bg-teal-50 text-teal-700 border border-teal-100'}`}>
                      {goal.priority} Priority
                    </span>
                    
                    {/* Goal Status Badge */}
                    {(() => {
                      const calc = calculateGoalTargets(goal.deadline, goal.totalRequiredHours, goal.dailyAvailableHours, goal.completedHours);
                      if (!calc) return null;
                      
                      let badgeClasses = 'bg-gray-100 text-gray-800 border-gray-200';
                      if (calc.status === 'Completed') {
                        badgeClasses = 'bg-blue-100 text-blue-800 border-blue-200';
                      } else if (calc.status === 'Behind Schedule') {
                        badgeClasses = 'bg-red-100 text-red-800 border-red-200';
                      } else if (calc.status === 'On Track') {
                        badgeClasses = 'bg-green-100 text-green-800 border-green-200';
                      }

                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm border ${badgeClasses}`}>
                          {calc.status}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                  <Link
                    to={`/goals/edit/${goal._id}`}
                    className="p-1.5 bg-white text-emerald-600 rounded-full hover:bg-emerald-50 hover:text-brand transition-colors shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-1.5 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {goal.description && (
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {goal.description}
                </p>
              )}

              {/* Goal Calculations Section */}
              {(() => {
                const calc = calculateGoalTargets(goal.deadline, goal.totalRequiredHours, goal.dailyAvailableHours, goal.completedHours);
                if (calc) {
                  return (
                    <div className="mb-4 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-text-secondary text-xs">Days Left</span>
                          <span className="font-semibold text-emerald-700">{calc.daysRemaining}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-text-secondary text-xs">Daily Need</span>
                          <span className={`font-semibold ${!calc.isAchievable ? 'text-red-600' : 'text-emerald-700'}`}>
                            {calc.requiredDailyHours}h
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-text-secondary text-xs">Weekly</span>
                          <span className="font-semibold text-emerald-700">{calc.weeklyTarget}h</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-text-secondary text-xs">Monthly</span>
                          <span className="font-semibold text-emerald-700">{calc.monthlyTarget}h</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-emerald-800">Progress</span>
                          <span className="font-bold text-brand">{calc.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden border border-emerald-200/50">
                          <motion.div 
                            className="bg-gradient-to-r from-emerald-400 to-brand h-2.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${calc.progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {!calc.isAchievable && calc.status !== 'Completed' && (
                        <div className="mt-3 text-xs text-red-600 flex items-center bg-red-50 p-1.5 rounded-lg">
                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                          Requires more daily hours than available!
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              <div className="flex items-center space-x-4 text-xs text-text-secondary mt-auto pt-2 border-t border-emerald-100/30">
                {goal.deadline && (
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                )}
                {goal.totalRequiredHours !== undefined && (
                  <div className="flex items-center">
                    <TargetIcon className="w-3.5 h-3.5 mr-1" />
                    {goal.totalRequiredHours}h total
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
