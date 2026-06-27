import axios from 'axios';
import type { Goal, GoalFormData } from '../types/goal';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/goals/`;

// Helper to get auth header
const getAuthHeader = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

const getGoals = async (): Promise<Goal[]> => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

const getGoal = async (id: string): Promise<Goal> => {
  const response = await axios.get(API_URL + id, { headers: getAuthHeader() });
  return response.data;
};

const createGoal = async (goalData: GoalFormData): Promise<Goal> => {
  const response = await axios.post(API_URL, goalData, { headers: getAuthHeader() });
  return response.data;
};

const updateGoal = async (id: string, goalData: GoalFormData): Promise<Goal> => {
  const response = await axios.put(API_URL + id, goalData, { headers: getAuthHeader() });
  return response.data;
};

const deleteGoal = async (id: string): Promise<{ id: string }> => {
  const response = await axios.delete(API_URL + id, { headers: getAuthHeader() });
  return response.data;
};

const batchLogHours = async (logs: { goalId: string, hours: number }[]): Promise<any> => {
  const response = await axios.post(API_URL + 'batch-log', { logs }, { headers: getAuthHeader() });
  
  // If lastDailyLog is returned, we should also update the local user object to prevent the modal from popping up again
  if (response.data && response.data.lastDailyLog) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.lastDailyLog = response.data.lastDailyLog;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  return response.data;
};

const goalService = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  batchLogHours,
};

export default goalService;
