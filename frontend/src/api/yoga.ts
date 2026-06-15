import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/yoga`;

// Get or Create Profile
export const getProfile = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

// Update Experience Level
export const updateExperienceLevel = async (experienceLevel: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.put(`${API_URL}/profile/level`, { experienceLevel }, config);
  return response.data;
};

// Get Lessons
export const getLessons = async (params: { difficulty?: string, category?: string, maxDuration?: number }, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params
  };
  const response = await axios.get(`${API_URL}/lessons`, config);
  return response.data;
};

// Get Single Lesson
export const getLessonById = async (id: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/lessons/${id}`, config);
  return response.data;
};

// Toggle Favorite
export const toggleFavorite = async (id: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}/favorites/${id}`, {}, config);
  return response.data;
};

// Complete Session
export const completeSession = async (lessonId: string, durationMinutes: number, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}/sessions`, { lessonId, durationMinutes }, config);
  return response.data;
};

// Get Session Logs
export const getSessionLogs = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/sessions`, config);
  return response.data;
};
