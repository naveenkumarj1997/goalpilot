import { motion } from 'framer-motion';

export default function YearView({ currentDate, tasks, onMonthClick }: any) {
  const year = currentDate.getFullYear();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Calculate task counts per date
  const taskCounts: { [key: string]: number } = {};
  tasks.forEach((t: any) => {
    if (t.date && !t.completed) {
      taskCounts[t.date] = (taskCounts[t.date] || 0) + 1;
    }
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-slate-800/50 text-slate-500';
    if (count <= 2) return 'bg-blue-900/40 text-blue-300';
    if (count <= 5) return 'bg-blue-700/60 text-white';
    return 'bg-blue-500 text-white shadow-sm shadow-blue-500/20';
  };

  const renderMonth = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div 
        key={monthIndex} 
        onClick={() => onMonthClick(monthIndex)}
        className="flex flex-col p-4 bg-slate-900/40 border border-slate-700/50 rounded-xl hover:shadow-lg hover:bg-slate-800/50 transition-all cursor-pointer group"
      >
        <h3 className="text-sm font-bold text-slate-200 mb-3 group-hover:text-blue-400 transition-colors">
          {months[monthIndex]}
        </h3>
        
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((d, i) => (
            <div key={i} className="text-[10px] text-center font-medium text-slate-500">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) {
              return <div key={i} className="aspect-square"></div>;
            }
            
            const dateStr = new Date(year, monthIndex, day).toISOString().split('T')[0];
            const count = taskCounts[dateStr] || 0;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            
            return (
              <div 
                key={i} 
                className={`aspect-square rounded flex items-center justify-center text-[10px] font-medium transition-colors ${getHeatmapColor(count)} ${isToday ? 'ring-1 ring-offset-1 ring-blue-500 ring-offset-slate-900 font-bold' : ''}`}
                title={`${count} tasks on ${dateStr}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto w-full">
        {months.map((_, i) => renderMonth(i))}
      </div>
    </div>
  );
}
