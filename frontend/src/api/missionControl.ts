import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export const getPlan = async (token: string, date: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/mission-control/plan?date=${date}`, config);
  return response.data;
};

export const generatePlan = async (token: string, mode: 'ai' | 'manual', date: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/mission-control/generate`, { mode, date }, config);
  return response.data;
};

export const updateTask = async (
  token: string, 
  taskId: string, 
  updates: { startTime?: string | null; endTime?: string; completed?: boolean; priority?: string; color?: string },
  date: string
) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/mission-control/task`, { taskId, ...updates, date }, config);
  return response.data;
};

export const removeTask = async (token: string, taskId: string, date: string) => {
  const config = { 
    headers: { Authorization: `Bearer ${token}` },
    params: { date }
  };
  const response = await axios.delete(`${API_URL}/mission-control/task/${taskId}`, config);
  return response.data;
};

export const addCustomTask = async (
  token: string,
  title: string,
  startTime: string,
  endTime: string | undefined,
  color: string,
  date: string
) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/mission-control/task`, { title, startTime, endTime, priority: 'Medium', color, date }, config);
  return response.data;
};

export const submitCheckIn = async (
  token: string, 
  data: { type: 'morning' | 'evening'; mood?: string; intent?: string; reflection?: string; rating?: number; date: string }
) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/mission-control/checkin`, data, config);
  return response.data;
};
