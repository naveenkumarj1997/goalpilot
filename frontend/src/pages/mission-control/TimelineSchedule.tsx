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
  onTaskDrop: (taskId: string, newStartTime: string) => void;
  onTaskComplete: (taskId: string, completed: boolean) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM (22:00)

export default function TimelineSchedule({ tasks, onTaskDrop, onTaskComplete }: TimelineScheduleProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

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
            <div className="flex-1 border-l-2 border-emerald-500/20 pl-4 relative py-1 border-t border-slate-800/50 group-hover:bg-slate-800/30 transition-colors rounded-r-xl">
              {tasksInHour.length === 0 && (
                <div className="absolute inset-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-xs text-slate-600 font-medium tracking-wider">Drop task here</span>
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
    </div>
  );
}
