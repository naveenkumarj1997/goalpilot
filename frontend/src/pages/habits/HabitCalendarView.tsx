import React, { useState } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import type { Habit } from '../../types/habit';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface HabitCalendarViewProps {
  habits: Habit[];
  onClose: () => void;
}

export default function HabitCalendarView({ habits, onClose }: HabitCalendarViewProps) {
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(habits.length > 0 ? habits[0]._id : null);

  const selectedHabit = habits.find(h => h._id === selectedHabitId);
  const today = new Date();
  today.setHours(0,0,0,0);

  // Get past 3 months including current
  const months = [
    subMonths(today, 2),
    subMonths(today, 1),
    today
  ];

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        let isLogged = false;
        let isMissed = false;
        let isFuture = day > today;

        const toLocalYYYYMMDD = (d: Date) => {
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        if (selectedHabit) {
          const cloneDayStr = toLocalYYYYMMDD(cloneDay);
          isLogged = selectedHabit.logs.some(l => l.substring(0, 10) === cloneDayStr);
          
          const habitStart = new Date(selectedHabit.createdAt || selectedHabit.startDate || new Date());
          habitStart.setHours(0,0,0,0);

          if (!isLogged && !isFuture && cloneDay >= habitStart) {
            isMissed = true;
          }
        }

        days.push(
          <div
            key={day.toString()}
            className={`
              flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 text-[10px] sm:text-xs rounded-full m-0.5 mx-auto
              ${!isSameMonth(day, monthStart) ? 'text-slate-600 opacity-30' : 'text-slate-300'}
              ${isLogged && isSameMonth(day, monthStart) ? 'font-bold shadow-md' : ''}
              ${isMissed && isSameMonth(day, monthStart) ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
              ${isSameDay(day, today) && !isLogged ? 'ring-1 ring-blue-500' : ''}
            `}
            style={{
              backgroundColor: (isLogged && isSameMonth(day, monthStart)) ? (selectedHabit?.color || '#10b981') : undefined,
              color: (isLogged && isSameMonth(day, monthStart)) ? '#ffffff' : undefined,
            }}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 shadow-lg w-full">
        <h3 className="text-center font-bold text-white mb-4">{format(monthStart, 'MMMM yyyy')}</h3>
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <div key={i} className="text-center text-xs font-semibold text-slate-500">
              {d}
            </div>
          ))}
        </div>
        <div>{rows}</div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="overflow-hidden"
    >
      <div className="p-4 sm:p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-400" />
            3-Month History
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
            No habits to display. Create one first!
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {habits.map(habit => (
                <button
                  key={habit._id}
                  onClick={() => setSelectedHabitId(habit._id)}
                  className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 border
                    ${selectedHabitId === habit._id 
                      ? 'bg-slate-800 text-white shadow-md' 
                      : 'bg-slate-900/50 text-slate-400 border-transparent hover:bg-slate-800'}
                  `}
                  style={{
                    borderColor: selectedHabitId === habit._id ? habit.color : 'transparent'
                  }}
                >
                  <span>{habit.badge}</span>
                  {habit.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {months.map((m, i) => (
                <div key={i}>{renderMonth(m)}</div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mt-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-md"
                  style={{ backgroundColor: selectedHabit?.color || '#10b981' }}
                ></div>
                <span>Logged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/10 border border-red-500/20"></div>
                <span>Missed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-blue-500"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
