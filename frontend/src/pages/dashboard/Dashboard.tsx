import { useState, useEffect } from 'react';
import { Target, CheckCircle, TrendingUp, CalendarDays, CheckSquare, Activity } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import GoalMatrixCard from '../../components/dashboard/GoalMatrixCard';
import goalService from '../../services/goalService';
import taskService from '../../services/taskService';
import habitService from '../../services/habitService';
import type { Goal } from '../../types/goal';
import type { Task } from '../../types/task';
import type { Habit } from '../../types/habit';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [goalsData, tasksData, habitsData] = await Promise.all([
        goalService.getGoals(),
        taskService.getTasks(),
        habitService.getHabits()
      ]);
      setGoals(goalsData);
      setTasks(tasksData);
      setHabits(habitsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleTask = async (task: Task) => {
    try {
      const updated = await taskService.updateTask(task._id, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, completed: updated.completed } : t));
    } catch (error) {
      console.error('Failed to toggle task', error);
    }
  };

  const handleToggleHabit = async (habit: Habit) => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const updated = await habitService.toggleLogHabit(habit._id, todayStr);
      setHabits(habits.map(h => h._id === habit._id ? updated : h));
    } catch (error) {
      console.error('Failed to log habit', error);
    }
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.totalRequiredHours && g.completedHours && g.completedHours >= g.totalRequiredHours).length;
  const activeGoals = totalGoals - completedGoals;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  const stats: { title: string; value: string; icon: any; trend: string; trendDirection: 'neutral'; color: 'brand' | 'green' | 'gold' | 'violet' }[] = [
    { title: 'Total Goals', value: totalGoals.toString(), icon: Target, trend: '', trendDirection: 'neutral' as const, color: 'brand' },
    { title: 'Completed Goals', value: completedGoals.toString(), icon: CheckCircle, trend: '', trendDirection: 'neutral' as const, color: 'green' },
    { title: 'Active Goals', value: activeGoals.toString(), icon: TrendingUp, trend: '', trendDirection: 'neutral' as const, color: 'gold' },
    { title: "Pending Tasks", value: pendingTasks.toString(), icon: CalendarDays, trend: '', trendDirection: 'neutral' as const, color: 'violet' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-slide-up-fade">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Goal Consistency Tracker */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center neon-text-brand tracking-wide">
            <Target className="mr-2 h-6 w-6 text-brand animate-ps-glow rounded-full p-0.5" /> Goal Consistency Tracker
          </h3>
          {loading ? (
            <div className="text-text-secondary">Loading your matrix...</div>
          ) : goals.filter(g => g.totalRequiredHours).length === 0 ? (
            <div className="text-text-secondary bg-white/50 p-6 rounded-2xl border border-emerald-50">
              You don't have any measurable goals yet. Create a goal with "Total Required Hours" to see your tracking matrix here!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {goals.filter(g => g.totalRequiredHours).map(goal => (
                <GoalMatrixCard key={goal._id} goal={goal} />
              ))}
            </div>
          )}
        </div>

        {/* Right column: Tasks and Habits quick view */}
        <div className="space-y-6">
          {/* Quick Tasks */}
          <div className="glass p-6 rounded-2xl shadow-sm border border-brand/30 hover:border-brand/70 neon-border-brand transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary flex items-center neon-text-brand">
                <CheckSquare className="mr-2 h-5 w-5 text-brand" /> Pending Tasks
              </h3>
              <Link to="/tasks" className="text-sm text-brand hover:underline">View All</Link>
            </div>
            {loading ? (
              <p className="text-sm text-text-secondary">Loading...</p>
            ) : tasks.filter(t => !t.completed).length === 0 ? (
              <p className="text-sm text-text-secondary italic">All caught up!</p>
            ) : (
              <ul className="space-y-3">
                {tasks.filter(t => !t.completed).slice(0, 5).map(task => (
                  <li key={task._id} className="flex items-center gap-3">
                    <button 
                      onClick={() => handleToggleTask(task)}
                      className="w-5 h-5 rounded border border-brand/50 flex items-center justify-center hover:bg-brand/20 text-transparent hover:text-brand transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-text-primary truncate flex-1">{task.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Habits */}
          <div className="glass p-6 rounded-2xl shadow-sm border border-purple-500/30 hover:border-purple-500/70 neon-border-purple transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary flex items-center text-purple-100" style={{ textShadow: '0 0 5px rgba(168,85,247,0.8), 0 0 15px rgba(168,85,247,0.5)' }}>
                <Activity className="mr-2 h-5 w-5 text-purple-400" /> Daily Habits
              </h3>
              <Link to="/habits" className="text-sm text-brand hover:underline">View All</Link>
            </div>
            {loading ? (
              <p className="text-sm text-text-secondary">Loading...</p>
            ) : habits.length === 0 ? (
              <p className="text-sm text-text-secondary italic">No habits tracking yet.</p>
            ) : (
              <ul className="space-y-3">
                {habits.slice(0, 5).map(habit => {
                  const isLoggedToday = habit.logs.includes(todayStr);
                  return (
                    <li key={habit._id} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-text-primary truncate flex-1">{habit.name}</span>
                      <button 
                        onClick={() => handleToggleHabit(habit)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isLoggedToday 
                            ? 'bg-brand text-white shadow-[0_0_10px_rgba(0,112,209,0.5)]' 
                            : 'bg-white/10 text-text-secondary hover:bg-brand/20 hover:text-brand'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
