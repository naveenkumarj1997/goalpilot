import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stoicism`;

export const getProfile = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

export const getLessons = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/lessons`, config);
  return response.data;
};

export const completeLesson = async (lessonId: string, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/lessons/${lessonId}/complete`, {}, config);
  return response.data;
};

export const getDailyQuote = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/quotes/daily`, config);
  return response.data;
};

export const getQuotes = async (params: { query?: string, author?: string }, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` }, params };
  const response = await axios.get(`${API_URL}/quotes`, config);
  return response.data;
};

export const getJournal = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/journal`, config);
  return response.data;
};

export const createJournalEntry = async (data: { reflection?: string, challenge?: string, lessonLearned?: string }, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/journal`, data, config);
  return response.data;
};

export const completeExercise = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/exercises/complete`, {}, config);
  return response.data;
};

export const completeChallenge = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/challenges/complete`, {}, config);
  return response.data;
};
