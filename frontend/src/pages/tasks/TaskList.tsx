import { useState, useEffect, useRef } from 'react';
import taskService from '../../services/taskService';
import type { Task } from '../../types/task';
import { Plus, Check, ChevronDown, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await taskService.createTask({ title: newTaskTitle });
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    // Optimistic update
    const updatedTasks = tasks.map(t => 
      t._id === task._id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    try {
      await taskService.updateTask(task._id, { completed: !task.completed });
    } catch (error) {
      // Revert on error
      setTasks(tasks);
      console.error('Failed to update task', error);
    }
  };

  const handleUpdateDetails = async (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(t => 
      t._id === id ? { ...t, ...updates } : t
    );
    setTasks(updatedTasks);

    try {
      await taskService.updateTask(id, updates);
    } catch (error) {
      setTasks(tasks);
      console.error('Failed to update task details', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t._id !== id));
    try {
      await taskService.deleteTask(id);
    } catch (error) {
      fetchTasks();
      console.error('Failed to delete task', error);
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-text-primary">My Tasks</h1>
      </div>

      {/* Quick Add */}
      <div className="glass rounded-2xl shadow-sm overflow-hidden flex items-center p-3 neon-border-brand transition-all">
        <Plus className="w-5 h-5 text-brand mr-3 ml-2" />
        <input
          type="text"
          placeholder="Add a task..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-secondary py-2 focus:outline-none"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreateTask();
          }}
        />
        <button 
          onClick={() => handleCreateTask()}
          disabled={!newTaskTitle.trim()}
          className="btn-primary px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-text-secondary">Loading tasks...</div>
      ) : (
        <div className="space-y-4">
          
          {/* Pending Tasks */}
          <div className="glass rounded-2xl shadow-sm overflow-hidden neon-border-brand">
            {pendingTasks.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                You have no pending tasks. Enjoy your day!
              </div>
            ) : (
              <AnimatePresence>
                {pendingTasks.map(task => (
                  <TaskItem 
                    key={task._id} 
                    task={task} 
                    onToggleComplete={() => handleToggleComplete(task)}
                    onUpdate={(updates) => handleUpdateDetails(task._id, updates)}
                    onDelete={() => handleDeleteTask(task._id)}
                    isEditing={editingTaskId === task._id}
                    setEditing={(isEditing) => setEditingTaskId(isEditing ? task._id : null)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-8">
              <button 
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center text-text-secondary font-medium hover:text-text-primary transition-colors mb-4 px-2"
              >
                {showCompleted ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                Completed ({completedTasks.length})
              </button>

              <AnimatePresence>
                {showCompleted && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="glass rounded-2xl shadow-sm overflow-hidden"
                  >
                    {completedTasks.map(task => (
                      <TaskItem 
                        key={task._id} 
                        task={task} 
                        onToggleComplete={() => handleToggleComplete(task)}
                        onUpdate={(updates) => handleUpdateDetails(task._id, updates)}
                        onDelete={() => handleDeleteTask(task._id)}
                        isEditing={editingTaskId === task._id}
                        setEditing={(isEditing) => setEditingTaskId(isEditing ? task._id : null)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// Subcomponent for individual task
function TaskItem({ 
  task, 
  onToggleComplete, 
  onUpdate, 
  onDelete, 
  isEditing, 
  setEditing 
}: { 
  task: Task, 
  onToggleComplete: () => void,
  onUpdate: (updates: Partial<Task>) => void,
  onDelete: () => void,
  isEditing: boolean,
  setEditing: (val: boolean) => void
}) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`border-b border-brand/10 last:border-b-0 transition-colors ${task.completed ? 'opacity-60' : 'hover:bg-brand/10'}`}
    >
      <div className="p-4 flex items-start group">
        {/* Circular Checkbox */}
        <button 
          onClick={onToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
            task.completed 
              ? 'bg-brand border-brand' 
              : 'border-brand/40 hover:border-brand text-transparent hover:text-brand/30'
          }`}
        >
          {task.completed ? <Check className="w-3.5 h-3.5 text-white" /> : <Check className="w-3.5 h-3.5 currentColor" />}
        </button>

        <div className="ml-4 flex-1 cursor-text" onClick={() => !isEditing && setEditing(true)}>
          {isEditing ? (
            <input 
              autoFocus
              type="text"
              value={task.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false); }}
              className="w-full bg-transparent border-none p-0 text-text-primary focus:ring-0 font-medium focus:outline-none"
            />
          ) : (
            <div className={`font-medium ${task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
              {task.title}
            </div>
          )}

          {/* Details / Date snippet when not editing but has content */}
          {!isEditing && (task.details || task.date) && (
            <div className="text-xs text-text-secondary mt-1 flex flex-col gap-1">
              {task.details && <div>{task.details.length > 50 ? task.details.substring(0, 50) + '...' : task.details}</div>}
              {task.date && <div className="text-brand/80 font-medium">{new Date(task.date).toLocaleDateString()}</div>}
            </div>
          )}

          {/* Expanded Edit Form */}
          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 overflow-hidden space-y-3 pb-2"
              >
                <textarea
                  placeholder="Details"
                  value={task.details || ''}
                  onChange={(e) => onUpdate({ details: e.target.value })}
                  className="w-full text-sm border border-brand/30 bg-transparent rounded-lg p-2 focus:ring-1 focus:ring-brand focus:border-brand resize-none text-text-primary focus:outline-none"
                  rows={3}
                />
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={task.date ? task.date.split('T')[0] : ''}
                    onChange={(e) => onUpdate({ date: e.target.value })}
                    className="text-sm border border-brand/30 bg-transparent rounded-lg p-2 focus:ring-1 focus:ring-brand focus:border-brand text-text-primary focus:outline-none"
                  />
                  <div className="flex-1"></div>
                  <button onClick={() => setEditing(false)} className="text-sm font-medium text-brand">Done</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delete Button */}
        <button 
          onClick={onDelete}
          className="ml-2 p-1.5 text-text-secondary hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
