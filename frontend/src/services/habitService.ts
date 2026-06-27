import axios from 'axios';
import type { Habit, HabitFormData } from '../types/habit';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/habits/`;

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

const getHabits = async (): Promise<Habit[]> => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const createHabit = async (habitData: HabitFormData): Promise<Habit> => {
  const response = await axios.post(API_URL, habitData, getAuthHeaders());
  return response.data;
};

const deleteHabit = async (id: string): Promise<string> => {
  const response = await axios.delete(API_URL + id, getAuthHeaders());
  return response.data.id;
};

const toggleLogHabit = async (id: string, date: string): Promise<Habit> => {
  const response = await axios.post(API_URL + `${id}/toggle`, { date }, getAuthHeaders());
  return response.data;
};

const habitService = {
  getHabits,
  createHabit,
  deleteHabit,
  toggleLogHabit
};

export default habitService;
