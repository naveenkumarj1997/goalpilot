import axios from 'axios';
import type { Task, TaskFormData } from '../types/task';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/tasks/`;

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  }
  return {};
};

const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const createTask = async (taskData: TaskFormData): Promise<Task> => {
  const response = await axios.post(API_URL, taskData, getAuthHeaders());
  return response.data;
};

const updateTask = async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
  const response = await axios.put(API_URL + id, taskData, getAuthHeaders());
  return response.data;
};

const deleteTask = async (id: string): Promise<string> => {
  const response = await axios.delete(API_URL + id, getAuthHeaders());
  return response.data.id;
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
