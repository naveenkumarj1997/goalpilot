import { useState } from 'react';
import { Plus, Check, Calendar, Tag, Undo2, Bookmark, Pencil, Trash2, Bell } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import CreateTaskModal from './CreateTaskModal';

export default function DayView({ currentDate, tasks, onCreateTask, onUpdateTask, onDeleteTask }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const dateStr = currentDate.toISOString().split('T')[0];
  const dayOfWeek = currentDate.getDay();

  const isTaskCompletedOnDate = (t: any) => {
    if (t.recurrence?.type && t.recurrence.type !== 'none') {
      return t.completedDates?.includes(dateStr);
    }
    return t.completed;
  };

  const dayTasks = tasks.filter((t: any) => {
    if (!t.recurrence || t.recurrence.type === 'none') {
      return t.date === dateStr;
    }
    if (t.date > dateStr) return false;

    if (t.recurrence.type === 'daily') return true;
    if (t.recurrence.type === 'weekly' || t.recurrence.type === 'custom') {
      return t.recurrence.daysOfWeek?.includes(dayOfWeek);
    }
    return false;
  }).map((t: any) => ({
    ...t,
    isCompletedToday: isTaskCompletedOnDate(t)
  })).sort((a: any, b: any) => {
    if (!a.time && b.time) return 1;
    if (a.time && !b.time) return -1;
    if (a.time && b.time) return a.time.localeCompare(b.time);
    return 0;
  });

  const inboxTasks = tasks.filter((t: any) => !t.date && !t.completed);

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'border-red-500 bg-red-500/10 text-red-500';
    if (p === 'Medium') return 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
    if (p === 'Low') return 'border-blue-500 bg-blue-500/10 text-blue-500';
    return 'border-slate-300 bg-transparent text-slate-500';
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${m} ${ampm}`;
  };

  const getBadgeStyle = (name: string) => {
    const badges: any = {
      'Work': 'bg-blue-500/20 text-blue-400',
      'Travel': 'bg-yellow-500/20 text-yellow-400',
      'Meetings': 'bg-orange-500/20 text-orange-400',
      'Free Time': 'bg-teal-500/20 text-teal-400',
      'Learning': 'bg-indigo-500/20 text-indigo-400',
      'Health': 'bg-green-500/20 text-green-400',
      'Career': 'bg-purple-500/20 text-purple-400',
    };
    return badges[name] || 'bg-slate-800 text-slate-300';
  };

  const toggleTask = (task: any) => {
    const nextState = !task.isCompletedToday;
    if (task.recurrence?.type && task.recurrence.type !== 'none') {
      onUpdateTask(task._id, { toggleCompletedDate: dateStr, completed: nextState });
    } else {
      onUpdateTask(task._id, { completed: nextState });
    }
  };

  const handleEditTask = (task: any) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (taskData: any) => {
    if (taskToEdit) {
      onUpdateTask(taskToEdit._id, taskData);
    } else {
      onCreateTask(taskData);
    }
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleTestNotification = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }
    
    try {
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }
      
      if (permission === 'granted') {
        try {
          new Notification('Goal Pilot', {
            body: 'Notifications are working perfectly!',
          });
          // Add a fallback alert just so the user knows the code executed successfully!
          alert('Notification was sent to your OS! If you do not see a popup, please check your Windows Notifications tray (bottom right corner) or ensure Chrome notifications are enabled in Windows Settings.');
        } catch (err: any) {
          alert('Native notification failed. On Android, this might require a full PWA installation. Error: ' + err.message);
        }
      } else {
        alert('Please allow notifications in your browser settings.');
      }
    } catch (error: any) {
      alert('Notification error: ' + error.message);
    }
  };

  const TaskItem = ({ task, isGridItem = false, absolutePos = false, isSquished = false }: { task: any, isGridItem?: boolean, absolutePos?: boolean, isSquished?: boolean }) => {
    const controls = useAnimation();

    const handleDragEnd = async (event: any, info: any) => {
      if (info.offset.x < -40) {
        controls.start({ x: -90 });
      } else if (info.offset.x > 40) {
        controls.start({ x: 60 });
      } else {
        controls.start({ x: 0 });
      }
    };

    return (
      <motion.div layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative overflow-hidden group bg-slate-800 ${isGridItem ? 'rounded-lg shadow-md border border-slate-700/50' : 'border-b border-slate-700/50'} ${absolutePos ? 'h-full w-full' : 'mb-1'}`}>
        {/* Background Actions */}
        <div className="absolute inset-0 flex justify-between items-center px-4 z-0">
          <div className="flex items-center">
            <button onClick={() => { toggleTask(task); controls.start({ x: 0 }); }} className={`p-2 rounded-full bg-slate-900/50 transition-colors flex items-center justify-center ${task.isCompletedToday ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400'}`}>
              {task.isCompletedToday ? <Undo2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { handleEditTask(task); controls.start({ x: 0 }); }} className="p-2 rounded-full bg-slate-900/50 text-blue-400 hover:text-blue-300 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDeleteTask(task._id)} className="p-2 rounded-full bg-slate-900/50 text-red-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Foreground Draggable Item */}
        <motion.div 
          drag="x"
          dragConstraints={{ left: -90, right: 60 }}
          dragElastic={{ left: 0.1, right: 0.1 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className={`relative z-20 flex w-full ${absolutePos ? 'items-start pt-1.5' : 'items-center'} justify-between transition-colors cursor-grab active:cursor-grabbing ${task.isCompletedToday ? 'bg-slate-900 shadow-inner' : 'bg-slate-800 hover:bg-slate-700'} ${absolutePos ? 'h-full' : ''} ${isSquished ? 'p-1.5' : 'p-2 lg:px-3'}`}
        >
          <div className={`flex ${absolutePos ? 'items-start' : 'items-center'} ${isSquished ? 'gap-1.5' : 'gap-3'} flex-1 min-w-0`}>
            {task.time && !isGridItem && (
              <div className={`flex flex-col shrink-0 w-16 sm:w-20 text-right ${task.isCompletedToday ? 'text-slate-600' : 'text-blue-400'}`}>
                <span className="text-[10px] sm:text-[11px] font-bold">{formatTime(task.time)}</span>
                {task.endTime && <span className="text-[8px] sm:text-[9px] font-medium opacity-80">to {formatTime(task.endTime)}</span>}
              </div>
            )}
            {!task.time && !isGridItem && <div className="w-16 sm:w-20 shrink-0"></div>}

            <button 
              onClick={() => toggleTask(task)}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 rounded-[4px] flex items-center justify-center border transition-all ${absolutePos ? 'mt-[1px]' : ''} ${task.isCompletedToday ? 'bg-slate-600 border-slate-600' : getPriorityColor(task.priority)}`}
            >
              {task.isCompletedToday && <Check className="w-2.5 h-2.5 text-white" />}
            </button>
            
            <div className="flex flex-col min-w-0 pointer-events-none">
              <span className={`leading-tight ${isSquished ? 'text-[10px] truncate' : 'text-[11px] sm:text-xs whitespace-normal break-words'} ${task.isCompletedToday ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {task.title}
              </span>
              {(task.time || task.folder || task.badge || (task.recurrence && task.recurrence.type !== 'none')) && (
                <div className={`flex items-center mt-0.5 text-slate-500 font-medium flex-wrap ${isSquished ? 'gap-1 text-[8px]' : 'gap-1.5 text-[9px]'}`}>
                  {task.time && isGridItem && (
                    <span className={`flex items-center gap-0.5 text-blue-400 min-w-0`}>
                      <span className={isSquished ? 'truncate' : ''}>
                        {formatTime(task.time)} {task.endTime && `- ${formatTime(task.endTime)}`}
                      </span>
                    </span>
                  )}
                  {task.recurrence?.type !== 'none' && !isSquished && <span className="flex items-center gap-0.5 capitalize px-1 bg-slate-800 rounded">{task.recurrence.type}</span>}
                  {task.folder && task.folder !== 'Inbox' && !isSquished && <span className="flex items-center gap-0.5"><Tag className="w-2.5 h-2.5" /> {task.folder}</span>}
                  {task.badge && (
                    <span className={`flex items-center gap-0.5 px-1 rounded-sm capitalize ${getBadgeStyle(task.badge)}`}>
                      {!isSquished && <Bookmark className="w-2.5 h-2.5" />} {task.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const allDayTasks = dayTasks.filter(t => !t.time);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const timeTasks = dayTasks.filter(t => t.time).map(task => {
    const [sh, sm] = task.time.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    
    let durationMinutes = 60; // default 1 hour
    if (task.endTime) {
      const [eh, em] = task.endTime.split(':').map(Number);
      let endMinutes = eh * 60 + em;
      if (endMinutes < startMinutes) endMinutes += 24 * 60; 
      durationMinutes = endMinutes - startMinutes;
    }
    return { ...task, startMinutes, durationMinutes, endMinutes: startMinutes + durationMinutes };
  }).sort((a, b) => a.startMinutes - b.startMinutes || b.durationMinutes - a.durationMinutes);

  const clusters: any[][] = [];
  let currentCluster: any[] = [];
  let currentClusterEnd = 0;

  for (const task of timeTasks) {
    if (currentCluster.length === 0 || task.startMinutes < currentClusterEnd) {
      currentCluster.push(task);
      currentClusterEnd = Math.max(currentClusterEnd, task.endMinutes);
    } else {
      clusters.push(currentCluster);
      currentCluster = [task];
      currentClusterEnd = task.endMinutes;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  const positionedTasks: any[] = [];
  for (const cluster of clusters) {
    const columns: any[][] = [];
    
    for (const task of cluster) {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const lastTaskInCol = col[col.length - 1];
        if (lastTaskInCol.endMinutes <= task.startMinutes) {
          col.push(task);
          task.colIndex = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        task.colIndex = columns.length;
        columns.push([task]);
      }
    }
    
    const numColumns = columns.length;
    for (const task of cluster) {
      task.numColumns = numColumns;
      positionedTasks.push(task);
    }
  }

  return (
    <div className="relative flex flex-col lg:flex-row w-full h-full overflow-hidden">
      {/* Main Task Timeline */}
      <div className="flex-1 flex flex-col w-full max-h-[60vh] lg:max-h-full overflow-y-auto custom-scrollbar relative bg-slate-900/20">
        
        {/* Header */}
        <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md p-4 lg:p-6 border-b border-slate-700/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1 text-white">
              {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <p className="text-xs text-slate-400">Timeline View • Swipe right to complete, swipe left to edit</p>
          </div>
          <button 
            type="button"
            onClick={handleTestNotification} 
            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2 shrink-0 ml-2"
          >
            <Bell className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">Test Alert</span>
          </button>
        </div>

        <div className="flex-1 pb-32">
          {/* All Day Section */}
          {allDayTasks.length > 0 && (
            <div className="mb-6 mx-4 lg:mx-6 mt-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">All Day</h3>
              <div className="flex flex-col rounded-xl border border-slate-700/50 overflow-hidden bg-slate-900/40 shadow-inner">
                <AnimatePresence mode="popLayout">
                  {allDayTasks.map((task: any) => (
                    <TaskItem key={task._id} task={task} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* 24-Hour Grid */}
          <div className="flex flex-col relative mt-2 px-2 lg:px-4 border-t border-slate-700/50">
            {/* Grid Background */}
            {hours.map(hour => {
              const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              
              return (
                <div key={hour} className="flex h-[60px] group border-b border-slate-700/50 relative">
                  {/* Time Column */}
                  <div className="w-14 shrink-0 relative">
                    <span className="absolute -top-2.5 right-2 text-[10px] font-bold text-slate-500 bg-slate-900/40 px-0.5 rounded z-10">
                      {displayHour} {ampm}
                    </span>
                    <span className="absolute top-[11px] right-2 text-[8px] text-slate-600/50">15</span>
                    <span className="absolute top-[26px] right-2 text-[8px] text-slate-600/50">30</span>
                    <span className="absolute top-[41px] right-2 text-[8px] text-slate-600/50">45</span>
                  </div>
                  {/* Content Column with Grid Line */}
                  <div className="flex-1 border-l border-slate-700/50 relative">
                    <div className="absolute top-[25%] left-0 right-0 border-t border-dashed border-slate-700/30" />
                    <div className="absolute top-[50%] left-0 right-0 border-t border-dashed border-slate-700/40" />
                    <div className="absolute top-[75%] left-0 right-0 border-t border-dashed border-slate-700/30" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-800/10 pointer-events-none transition-opacity" />
                  </div>
                </div>
              );
            })}

            {/* Absolutely Positioned Tasks */}
            <div className="absolute top-0 left-[72px] lg:left-[80px] right-4 bottom-0 pointer-events-none">
              <div className="relative w-full h-full">
                <AnimatePresence mode="popLayout">
                  {positionedTasks.map(task => {
                    const topPercentage = (task.startMinutes / (24 * 60)) * 100;
                    const heightPercentage = (task.durationMinutes / (24 * 60)) * 100;
                    
                    const widthPercentage = 100 / task.numColumns;
                    const leftPercentage = task.colIndex * widthPercentage;

                    return (
                      <div 
                        key={task._id} 
                        className="absolute pointer-events-auto p-0.5"
                        style={{ 
                          top: `${topPercentage}%`, 
                          height: `${heightPercentage}%`,
                          left: `${leftPercentage}%`,
                          width: `${widthPercentage}%`,
                          minHeight: '24px',
                          zIndex: task.isCompletedToday ? 10 : 20
                        }}
                      >
                        <TaskItem task={task} isGridItem={true} absolutePos={true} isSquished={task.numColumns > 1} />
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inbox Sidebar - Only show if there are tasks */}
      {inboxTasks.length > 0 && (
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-700/50 bg-slate-900/30 flex flex-col p-4 shrink-0 max-h-[40vh] lg:max-h-full overflow-hidden">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 shrink-0">
            Inbox <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{inboxTasks.length}</span>
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {inboxTasks.map((task: any) => (
              <div key={task._id} className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg shadow-sm group shrink-0">
                <span className="text-xs text-slate-200 block mb-2">{task.title}</span>
                <button 
                  onClick={() => onUpdateTask(task._id, { date: dateStr })}
                  className="w-full py-1.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                >
                  Schedule for Today
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
        className="absolute bottom-6 right-6 lg:bottom-10 lg:right-80 w-14 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white hover:bg-blue-600 hover:scale-105 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onSubmit={handleModalSubmit}
        defaultDate={dateStr}
        initialData={taskToEdit}
      />
    </div>
  );
}
