import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export const getTodayPlan = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/mission-control/today`, config);
  return response.data;
};

export const generatePlan = async (token: string, mode: 'ai' | 'manual') => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/mission-control/generate`, { mode }, config);
  return response.data;
};

export const updateTask = async (
  token: string, 
  taskId: string, 
  updates: { startTime?: string; endTime?: string; completed?: boolean; priority?: string }
) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/mission-control/task`, { taskId, ...updates }, config);
  return response.data;
};

export const submitCheckIn = async (
  token: string, 
  data: { type: 'morning' | 'evening'; mood?: string; intent?: string; reflection?: string; rating?: number }
) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/mission-control/checkin`, data, config);
  return response.data;
};
