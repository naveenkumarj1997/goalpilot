import type { Goal } from '../types/goal';

export interface MatrixCell {
  date: string; // YYYY-MM-DD
  required: number;
  logged: number;
  status: 'achieved' | 'failed' | 'future';
}

export const generateGoalMatrix = (goal: Goal): MatrixCell[] => {
  if (!goal.createdAt || !goal.deadline || !goal.totalRequiredHours) {
    return [];
  }

  const startDate = new Date(goal.createdAt);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(goal.deadline);
  endDate.setHours(0, 0, 0, 0);
  
  if (endDate < startDate) {
    return []; // Invalid dates
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1);
  
  let remainingHours = goal.totalRequiredHours;
  let remainingDays = totalDays;

  const matrix: MatrixCell[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const isFuture = currentDate > today;
    const requiredForDay = remainingDays > 0 ? remainingHours / remainingDays : 0;
    
    // Sum logs for this specific date
    let loggedOnDay = 0;
    if (goal.timeLogs) {
      goal.timeLogs.forEach(log => {
        const logDate = new Date(log.date);
        if (
          logDate.getDate() === currentDate.getDate() &&
          logDate.getMonth() === currentDate.getMonth() &&
          logDate.getFullYear() === currentDate.getFullYear()
        ) {
          loggedOnDay += log.hours;
        }
      });
    }

    let status: 'achieved' | 'failed' | 'future' = 'future';
    if (!isFuture) {
      // If we required something and logged enough, or required 0 and didn't fail
      if (loggedOnDay >= requiredForDay - 0.01) { // small tolerance
        status = 'achieved';
      } else {
        status = 'failed';
      }
    }

    matrix.push({
      date: currentDate.toISOString().split('T')[0],
      required: requiredForDay,
      logged: loggedOnDay,
      status
    });

    // Retroactive calculation for the next day
    remainingHours = Math.max(0, remainingHours - loggedOnDay);
    remainingDays = Math.max(1, remainingDays - 1);
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return matrix;
};
