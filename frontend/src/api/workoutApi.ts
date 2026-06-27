import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/workouts`;

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return {};
  const user = JSON.parse(userStr);
  return { headers: { Authorization: `Bearer ${user.token}` } };
};

export const workoutApi = {
  getProfile: () => axios.get(`${API_URL}/profile`, getAuthHeaders()),
  updateProfile: (data: any) => axios.post(`${API_URL}/profile`, data, getAuthHeaders()),
  getExercises: () => axios.get(`${API_URL}/exercises`, getAuthHeaders()),
  generatePlan: () => axios.post(`${API_URL}/generate-plan`, {}, getAuthHeaders()),
  getPlan: () => axios.get(`${API_URL}/plan`, getAuthHeaders()),
  logSession: (data: any) => axios.post(`${API_URL}/session`, data, getAuthHeaders()),
  getStats: () => axios.get(`${API_URL}/stats`, getAuthHeaders()),
  getBodyMetrics: () => axios.get(`${API_URL}/body-metrics`, getAuthHeaders()),
  addBodyMetric: (data: any) => axios.post(`${API_URL}/body-metrics`, data, getAuthHeaders())
};
