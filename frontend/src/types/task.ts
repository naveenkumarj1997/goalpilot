export interface Task {
  _id: string;
  title: string;
  details?: string;
  date?: string;
  completed: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  details?: string;
  date?: string;
  completed?: boolean;
}
