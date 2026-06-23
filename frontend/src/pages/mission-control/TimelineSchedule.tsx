import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PlannedTask {
  id: string;
  title: string;
  sourceModule: string;
  startTime?: string;
  endTime?: string;
  completed: boolean;
  priority: string;
}

interface TimelineScheduleProps {
  tasks: PlannedTask[];
  unscheduledTasks: PlannedTask[];
  onTaskDrop: (taskId: string, newStartTime: string) => void;
  onTaskComplete: (taskId: string, completed: boolean) => void;
  onCreateCustomTask: (title: string, newStartTime: string) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM (22:00)

export default function TimelineSchedule({ tasks, unscheduledTasks, onTaskDrop, onTaskComplete, onCreateCustomTask }: TimelineScheduleProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [customTaskTitle, setCustomTaskTitle] = useState('');

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const formattedHour = hour.toString().padStart(2, '0') + ':00';
      onTaskDrop(taskId, formattedHour);
    }
    setDraggedTaskId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500/20 border-red-500/50 text-red-200';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-200';
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full custom-scrollbar overflow-y-auto max-h-[70vh] pr-2">
      {HOURS.map(hour => {
        const formattedHour = hour.toString().padStart(2, '0') + ':00';
        const tasksInHour = tasks.filter(t => t.startTime === formattedHour);

        return (
          <div 
            key={hour} 
            className="flex w-full group relative min-h-[60px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, hour)}
          >
            {/* Time Label */}
            <div className="w-16 flex-shrink-0 text-right pr-4 text-xs font-bold text-slate-500 pt-2">
              {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
            </div>
            
            {/* Slot Area */}
            <div 
              className="flex-1 border-l-2 border-emerald-500/20 pl-4 relative py-1 border-t border-slate-800/50 group-hover:bg-slate-800/30 transition-colors rounded-r-xl cursor-pointer"
              onClick={() => setSelectedHour(hour)}
            >
              {tasksInHour.length === 0 && (
                <div className="absolute inset-0 flex items-center pl-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-xs text-slate-500/70 font-medium tracking-wider bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">Tap to schedule</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2 relative z-10">
                {tasksInHour.map(task => (
                  <motion.div
                    layout
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, task.id)}
                    onDragEnd={() => setDraggedTaskId(null)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-grab active:cursor-grabbing backdrop-blur-sm shadow-lg ${getPriorityColor(task.priority)} ${task.completed ? 'opacity-50 grayscale' : ''} ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => onTaskComplete(task.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">{task.sourceModule}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Schedule Modal */}
      {selectedHour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              Schedule at {selectedHour % 12 || 12}:00 {selectedHour >= 12 ? 'PM' : 'AM'}
            </h3>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Create Custom Task</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  placeholder="e.g. Call John, Read book..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand transition-colors"
                />
                <button 
                  onClick={() => {
                    if (customTaskTitle.trim()) {
                      const formattedHour = selectedHour.toString().padStart(2, '0') + ':00';
                      onCreateCustomTask(customTaskTitle, formattedHour);
                      setCustomTaskTitle('');
                      setSelectedHour(null);
                    }
                  }}
                  className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-xl font-bold transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {unscheduledTasks.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Or pick from Inbox</label>
                <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                  {unscheduledTasks.map(task => (
                    <button 
                      key={task.id}
                      onClick={() => {
                        const formattedHour = selectedHour.toString().padStart(2, '0') + ':00';
                        onTaskDrop(task.id, formattedHour);
                        setSelectedHour(null);
                      }}
                      className="w-full text-left p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-bold text-white">{task.title}</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold bg-slate-900 px-2 py-1 rounded">{task.sourceModule}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => {
                setSelectedHour(null);
                setCustomTaskTitle('');
              }}
              className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
