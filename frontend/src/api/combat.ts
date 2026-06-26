import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/combat`;

export interface CombatProfileData {
  gender?: string;
  age?: number;
  weight?: number;
  height?: number;
  experienceLevel?: string;
  goals?: string[];
  equipment?: string[];
  trainingHours?: number;
  lessonsCompleted?: number;
  workoutsCompleted?: number;
  punchCount?: number;
  roundsCompleted?: number;
  caloriesBurned?: number;
  currentStreak?: number;
  longestStreak?: number;
  achievements?: any[];
}

const getAuthHeader = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export const getProfile = async (): Promise<CombatProfileData> => {
  const response = await axios.get(`${API_URL}/profile`, { headers: getAuthHeader() });
  return response.data;
};

export const updateProfile = async (data: Partial<CombatProfileData>): Promise<CombatProfileData> => {
  const response = await axios.post(`${API_URL}/profile`, data, { headers: getAuthHeader() });
  return response.data;
};

export const getRoadmap = async (): Promise<any> => {
  const response = await axios.get(`${API_URL}/roadmap`, { headers: getAuthHeader() });
  return response.data;
};

export const generateRoadmap = async (): Promise<any> => {
  const response = await axios.post(`${API_URL}/roadmap`, {}, { headers: getAuthHeader() });
  return response.data;
};

export const getLessons = async (discipline?: string, category?: string): Promise<any[]> => {
  const params = new URLSearchParams();
  if (discipline) params.append('discipline', discipline);
  if (category) params.append('category', category);
  
  const response = await axios.get(`${API_URL}/lessons?${params.toString()}`, { headers: getAuthHeader() });
  return response.data;
};

export const logWorkout = async (workoutData: any): Promise<any> => {
  const response = await axios.post(`${API_URL}/log-workout`, workoutData, { headers: getAuthHeader() });
  return response.data;
};
