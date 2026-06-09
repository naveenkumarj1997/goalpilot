export interface Goal {
  _id: string;
  name: string;
  description?: string;
  deadline?: string; // ISO date string
  totalRequiredHours?: number;
  completedHours?: number;
  timeLogs?: { date: string; hours: number }[];
  priority: 'Low' | 'Medium' | 'High';
  dailyAvailableHours?: number;
  category?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  name: string;
  description?: string;
  deadline?: string;
  totalRequiredHours?: number;
  completedHours?: number;
  priority: 'Low' | 'Medium' | 'High';
  dailyAvailableHours?: number;
  category?: string;
}
