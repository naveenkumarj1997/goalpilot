export interface GoalCalculations {
  daysRemaining: number;
  requiredDailyHours: number;
  weeklyTarget: number;
  monthlyTarget: number;
  isAchievable: boolean;
  progressPercentage: number;
  status: 'Completed' | 'Behind Schedule' | 'On Track';
}

export const calculateGoalTargets = (
  deadlineStr?: string,
  totalRequiredHours?: number,
  availableHoursPerDay?: number,
  completedHours: number = 0
): GoalCalculations | null => {
  if (!deadlineStr || !totalRequiredHours) {
    return null;
  }

  const deadline = new Date(deadlineStr);
  const today = new Date();
  
  // Set times to midnight to calculate full days correctly
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const timeDiff = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const remainingHours = Math.max(0, totalRequiredHours - completedHours);
  let progressPercentage = Math.round((completedHours / totalRequiredHours) * 100);
  if (progressPercentage > 100) progressPercentage = 100;

  if (remainingHours === 0) {
    return {
      daysRemaining,
      requiredDailyHours: 0,
      weeklyTarget: 0,
      monthlyTarget: 0,
      isAchievable: true,
      progressPercentage,
      status: 'Completed'
    };
  }

  if (daysRemaining <= 0) {
    return {
      daysRemaining: 0,
      requiredDailyHours: remainingHours,
      weeklyTarget: remainingHours,
      monthlyTarget: remainingHours,
      isAchievable: false,
      progressPercentage,
      status: 'Behind Schedule'
    };
  }

  const requiredDailyHours = Number((remainingHours / daysRemaining).toFixed(2));
  const weeklyTarget = Number((requiredDailyHours * Math.min(7, daysRemaining)).toFixed(2));
  const monthlyTarget = Number((requiredDailyHours * Math.min(30, daysRemaining)).toFixed(2));
  
  let isAchievable = true;
  if (availableHoursPerDay !== undefined && requiredDailyHours > availableHoursPerDay) {
    isAchievable = false;
  }

  let status: 'Completed' | 'Behind Schedule' | 'On Track' = 'On Track';
  if (!isAchievable) {
    status = 'Behind Schedule';
  }

  return {
    daysRemaining,
    requiredDailyHours,
    weeklyTarget,
    monthlyTarget,
    isAchievable,
    progressPercentage,
    status
  };
};
