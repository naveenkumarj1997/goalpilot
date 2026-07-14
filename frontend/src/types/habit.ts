export interface Habit {
  _id: string;
  name: string;
  frequency: string;
  color?: string;
  badge?: string;
  duration?: number;
  startDate?: string;
  logs: string[]; // ISO Date strings
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitFormData {
  name: string;
  frequency?: string;
  color?: string;
  badge?: string;
  duration?: number;
  startDate?: string;
}
