import { motion } from 'framer-motion';

export default function MonthView({ currentDate, tasks, onDateClick }: any) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateStr: new Date(year, month - 1, daysInPrevMonth - i).toISOString().split('T')[0]
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      dayNum: i,
      isCurrentMonth: true,
      dateStr: d.toISOString().split('T')[0],
      isToday: d.toDateString() === new Date().toDateString(),
      dateObj: d
    });
  }

  // Next month days to fill grid (6 rows of 7 = 42)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      dayNum: i,
      isCurrentMonth: false,
      dateStr: new Date(year, month + 1, i).toISOString().split('T')[0]
    });
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col w-full h-full p-2 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider py-1 sm:py-2">
            {d}
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1 md:gap-2 min-h-[350px] sm:min-h-0 pb-4 sm:pb-0">
        {days.map((day, i) => {
          const dayOfWeek = day.dateObj ? day.dateObj.getDay() : new Date(day.dateStr).getDay();
          const dayTasks = tasks.filter((t: any) => {
            if (!t.recurrence || t.recurrence.type === 'none') {
              return t.date === day.dateStr;
            }
            if (t.date > day.dateStr) return false;
            if (t.recurrence.type === 'daily') return true;
            if (t.recurrence.type === 'weekly' || t.recurrence.type === 'custom') {
              return t.recurrence.daysOfWeek?.includes(dayOfWeek);
            }
            return false;
          }).map((t: any) => ({
            ...t,
            isCompletedToday: (t.recurrence?.type && t.recurrence.type !== 'none') 
              ? t.completedDates?.includes(day.dateStr) 
              : t.completed
          }));

          const uncompletedCount = dayTasks.filter((t: any) => !t.isCompletedToday).length;
          const completedCount = dayTasks.filter((t: any) => t.isCompletedToday).length;

          return (
            <div 
              key={i}
              onClick={() => {
                if (day.isCurrentMonth && day.dateObj) {
                  onDateClick(day.dateObj);
                }
              }}
              className={`flex flex-col p-1 sm:p-2 border rounded-lg transition-colors cursor-pointer min-h-[50px] sm:min-h-0 ${
                day.isCurrentMonth 
                  ? day.isToday 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60' 
                  : 'border-transparent opacity-40 bg-slate-900/10'
              }`}
            >
              <span className={`text-[10px] sm:text-xs md:text-sm font-bold block text-right ${day.isToday ? 'text-blue-400' : 'text-slate-300'}`}>
                {day.dayNum}
              </span>
              
              <div className="mt-0 sm:mt-1 flex-1 flex flex-wrap items-center justify-center gap-1">
                {uncompletedCount > 0 && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex shrink-0 items-center justify-center rounded-full bg-red-500/20 border border-red-500 text-red-400 font-bold text-[9px] sm:text-[10px]">
                    {uncompletedCount}
                  </div>
                )}
                {completedCount > 0 && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold text-[9px] sm:text-[10px]">
                    {completedCount}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
