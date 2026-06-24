import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PlannedTask {
  id: string;
  title: string;
  sourceModule: string;
  startTime?: string;
  endTime?: string;
  completed: boolean;
  priority: string;
  color?: string;
}

interface TimelineScheduleProps {
  tasks: PlannedTask[];
  unscheduledTasks: PlannedTask[];
  onTaskDrop: (taskId: string, newStartTime: string | null, newEndTime?: string, color?: string) => void;
  onTaskComplete: (taskId: string, completed: boolean) => void;
  onCreateCustomTask: (title: string, newStartTime: string, newEndTime: string | undefined, color: string) => void;
  onRemoveTask: (taskId: string) => void;
}

const START_HOUR = 6;
const END_HOUR = 23; // End at 11 PM to show full 10 PM block
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);
const HOUR_HEIGHT = 80; // pixels per hour
const MIN_PER_HOUR = 60;
const PX_PER_MIN = HOUR_HEIGHT / MIN_PER_HOUR;

const COLORS = [
  { id: 'blue', class: 'bg-blue-500' },
  { id: 'emerald', class: 'bg-emerald-500' },
  { id: 'purple', class: 'bg-purple-500' },
  { id: 'orange', class: 'bg-orange-500' },
  { id: 'pink', class: 'bg-pink-500' },
];

export default function TimelineSchedule({ tasks, unscheduledTasks, onTaskDrop, onTaskComplete, onCreateCustomTask, onRemoveTask }: TimelineScheduleProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [customTaskTitle, setCustomTaskTitle] = useState('');

  const [modalStartTime, setModalStartTime] = useState('');
  const [modalEndTime, setModalEndTime] = useState('');
  const [modalColor, setModalColor] = useState('blue');

  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to current time on mount
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const currentHour = new Date().getHours();
      if (currentHour >= START_HOUR && currentHour < END_HOUR) {
        const yPos = (currentHour - START_HOUR) * HOUR_HEIGHT;
        containerRef.current.scrollTop = Math.max(0, yPos - 100);
      }
    }
  }, []);

  // --- Utility functions ---
  const parseTime = (timeStr?: string) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  const formatTimeDisplay = (timeStr?: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const formatTimeString = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // --- Drag & Drop / Click Handlers ---
  const calculateTimeFromY = (y: number, snapMinutes = 15) => {
    const totalMinutes = y / PX_PER_MIN + (START_HOUR * 60);
    const snappedMinutes = Math.round(totalMinutes / snapMinutes) * snapMinutes;
    return Math.max(START_HOUR * 60, Math.min((END_HOUR - 0.5) * 60, snappedMinutes)); // clamp
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    // We only want to trigger if we click the grid background, not an existing task
    const target = e.target as HTMLElement;
    if (target.closest('.task-card')) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    const startMins = calculateTimeFromY(y);
    const endMins = startMins + 30; // default 30 min duration
    
    setModalStartTime(formatTimeString(startMins));
    setModalEndTime(formatTimeString(endMins));
    setModalColor('blue');
    setIsScheduleModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    const startMins = calculateTimeFromY(y);
    
    // Try to preserve original duration, otherwise default to 30 mins
    const task = tasks.find(t => t.id === taskId) || unscheduledTasks.find(t => t.id === taskId);
    let durationMins = 30;
    let color = task?.color || 'blue';

    if (task && task.startTime && task.endTime) {
       const s = parseTime(task.startTime);
       const e = parseTime(task.endTime);
       if (s !== null && e !== null && e > s) {
         durationMins = e - s;
       }
    }
    const endMins = startMins + durationMins; 
    
    onTaskDrop(taskId, formatTimeString(startMins), formatTimeString(endMins), color);
    setDraggedTaskId(null);
  };

  const openRescheduleModal = () => {
    setIsRescheduling(true);
    setModalStartTime(selectedTask.startTime || '12:00');
    setModalEndTime(selectedTask.endTime || '13:00');
    setModalColor(selectedTask.color || 'blue');
  };

  const getTaskColorClass = (task: PlannedTask) => {
    if (task.color) {
      switch (task.color) {
        case 'blue': return 'bg-blue-500/20 border-blue-500/50 text-blue-200';
        case 'emerald': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200';
        case 'purple': return 'bg-purple-500/20 border-purple-500/50 text-purple-200';
        case 'orange': return 'bg-orange-500/20 border-orange-500/50 text-orange-200';
        case 'pink': return 'bg-pink-500/20 border-pink-500/50 text-pink-200';
      }
    }
    switch (task.priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 border-red-500/50 text-red-200';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-200';
    }
  };

  const getTaskStyle = (task: any) => {
    const startMins = task.startMins;
    const endMins = task.endMins;
    
    if (startMins === undefined) return { display: 'none' };
    
    const topPx = (startMins - START_HOUR * 60) * PX_PER_MIN;
    let heightPx = (endMins - startMins) * PX_PER_MIN;
    
    return {
      top: `${topPx}px`,
      height: `${Math.max(25, heightPx)}px`,
      width: `calc((100% - 5rem) / ${task.numCols || 1})`,
      left: `calc(4rem + (${task.col || 0} * (100% - 5rem) / ${task.numCols || 1}))`
    };
  };

  const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
  const showCurrentTimeLine = currentMins >= START_HOUR * 60 && currentMins < END_HOUR * 60;
  const currentTimeTop = (currentMins - START_HOUR * 60) * PX_PER_MIN;

  // Process overlapping tasks
  const scheduledTasksList = tasks
    .filter(t => t.startTime && t.endTime)
    .map(t => {
      const s = parseTime(t.startTime) || 0;
      const e = parseTime(t.endTime) || (s + 30);
      return { ...t, startMins: s, endMins: e, col: 0, numCols: 1 };
    })
    .sort((a, b) => a.startMins - b.startMins || b.endMins - a.endMins);

  const clusters: typeof scheduledTasksList[] = [];
  let currentCluster: typeof scheduledTasksList = [];
  let clusterEnd = 0;

  for (const task of scheduledTasksList) {
    if (currentCluster.length === 0) {
      currentCluster.push(task);
      clusterEnd = task.endMins;
    } else if (task.startMins < clusterEnd) {
      currentCluster.push(task);
      clusterEnd = Math.max(clusterEnd, task.endMins);
    } else {
      clusters.push(currentCluster);
      currentCluster = [task];
      clusterEnd = task.endMins;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  for (const cluster of clusters) {
    const columns: typeof cluster[] = [];
    for (const task of cluster) {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const lastTask = col[col.length - 1];
        // Allow tiny 1-2 min overlaps to just count as overlapping, but strictly it's <=
        if (lastTask.endMins <= task.startMins) {
          col.push(task);
          task.col = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        task.col = columns.length;
        columns.push([task]);
      }
    }
    for (const task of cluster) {
      task.numCols = columns.length;
    }
  }

  return (
    <div 
      ref={containerRef}
      className="w-full custom-scrollbar overflow-y-auto max-h-[70vh] pr-2 bg-slate-900/40 rounded-xl"
    >
      <div 
        ref={timelineRef}
        className="relative w-full cursor-pointer select-none"
        style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
        onClick={handleTimelineClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Render Hour Grid Lines */}
        {HOURS.map((hour, index) => (
          <div 
            key={hour}
            className="absolute w-full border-t border-slate-700/30 flex pointer-events-none grid-line"
            style={{ top: `${index * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
          >
            <div className="w-16 flex-shrink-0 text-right pr-4 text-xs font-bold text-slate-500 -mt-2">
              {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
            </div>
            <div className="flex-1 border-l-2 border-emerald-500/10"></div>
          </div>
        ))}

        {/* Current Time Indicator */}
        {showCurrentTimeLine && (
          <div 
            className="absolute left-16 right-0 z-40 pointer-events-none"
            style={{ top: `${currentTimeTop}px` }}
          >
            <div className="w-full h-[2px] bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)] relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] -ml-1"></div>
            </div>
          </div>
        )}

        {/* Scheduled Tasks */}
        {scheduledTasksList.map(task => {
          const style = getTaskStyle(task);
          const height = parseInt(style.height as string, 10);
          const isSmall = height < 50; // Use compact layout for short tasks

          return (
            <motion.div
              layout
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e as any, task.id)}
              onDragEnd={() => setDraggedTaskId(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTask(task);
              }}
              style={style}
              className={`absolute task-card rounded-lg border cursor-grab active:cursor-grabbing backdrop-blur-md shadow-lg overflow-hidden transition-all hover:z-50 hover:scale-[1.02] ${getTaskColorClass(task)} ${task.completed ? 'opacity-50 grayscale' : ''} ${draggedTaskId === task.id ? 'opacity-50 z-50' : 'z-20'}`}
            >
              <div className={`flex ${isSmall ? 'flex-row items-center' : 'flex-col items-start'} gap-2 h-full p-2`}>
                <input 
                  type="checkbox"
                  checked={task.completed}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onTaskComplete(task.id, e.target.checked)}
                  className={`w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900 cursor-pointer flex-shrink-0 ${isSmall ? '' : 'mt-0.5'}`}
                />
                <div className={`flex ${isSmall ? 'flex-row items-center flex-1 gap-3' : 'flex-col h-full'} min-w-0`}>
                  <span className={`text-sm font-bold truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</span>
                  <div className={`flex items-center gap-2 ${isSmall ? '' : 'mt-1'} truncate`}>
                    {!isSmall && <span className="text-[10px] uppercase tracking-widest opacity-80 font-bold bg-black/30 px-1.5 py-0.5 rounded">{task.sourceModule}</span>}
                    <span className="text-[10px] font-bold opacity-90 text-white truncate">
                      {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              Schedule Task
            </h3>
            
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Start Time</label>
                <input 
                  type="time" 
                  value={modalStartTime}
                  onChange={(e) => setModalStartTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">End Time</label>
                <input 
                  type="time" 
                  value={modalEndTime}
                  onChange={(e) => setModalEndTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Category Color</label>
              <div className="flex gap-3">
                {COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setModalColor(c.id)}
                    className={`w-8 h-8 rounded-full ${c.class} transition-transform hover:scale-110 ${modalColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Create Custom Task</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  placeholder="e.g. Call John, Read book..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 sm:py-2 text-white focus:outline-none focus:border-brand transition-colors w-full min-w-0"
                />
                <button 
                  onClick={() => {
                    if (customTaskTitle.trim()) {
                      onCreateCustomTask(customTaskTitle, modalStartTime, modalEndTime, modalColor);
                      setCustomTaskTitle('');
                      setIsScheduleModalOpen(false);
                    }
                  }}
                  className="bg-brand hover:bg-brand-hover text-white px-4 py-3 sm:py-2 rounded-xl font-bold transition-colors w-full sm:w-auto flex-shrink-0"
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
                        onTaskDrop(task.id, modalStartTime, modalEndTime, modalColor);
                        setIsScheduleModalOpen(false);
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
                setIsScheduleModalOpen(false);
                setCustomTaskTitle('');
              }}
              className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit/Remove Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setSelectedTask(null); setIsRescheduling(false); }}>
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">{selectedTask.title}</h3>
            <p className="text-sm text-slate-400 mb-6 uppercase tracking-wider">{selectedTask.sourceModule}</p>
            
            {isRescheduling ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Start Time</label>
                    <input 
                      type="time" 
                      value={modalStartTime}
                      onChange={(e) => setModalStartTime(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">End Time</label>
                    <input 
                      type="time" 
                      value={modalEndTime}
                      onChange={(e) => setModalEndTime(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Category Color</label>
                  <div className="flex gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setModalColor(c.id)}
                        className={`w-8 h-8 rounded-full ${c.class} transition-transform hover:scale-110 ${modalColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70'}`}
                      />
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onTaskDrop(selectedTask.id, modalStartTime, modalEndTime, modalColor);
                    setSelectedTask(null);
                    setIsRescheduling(false);
                  }}
                  className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold transition-colors"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setIsRescheduling(false)}
                  className="w-full py-3 mt-2 bg-transparent hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors"
                >
                  Back
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={openRescheduleModal}
                  className="w-full py-3 bg-brand/20 hover:bg-brand/30 text-brand rounded-xl font-bold transition-colors border border-brand/20"
                >
                  Edit Task Details
                </button>

                <button 
                  onClick={() => {
                    onTaskDrop(selectedTask.id, null);
                    setSelectedTask(null);
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  Move to Inbox
                </button>
                
                <button 
                  onClick={() => {
                    onRemoveTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-colors"
                >
                  Delete Completely
                </button>

                <button 
                  onClick={() => { setSelectedTask(null); setIsRescheduling(false); }}
                  className="w-full py-3 mt-4 bg-transparent hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
