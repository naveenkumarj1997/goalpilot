import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/meditation`;

export const getProfile = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/profile`, config);
  return res.data;
};

export const updateProfile = async (data: any, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(`${API_URL}/profile`, data, config);
  return res.data;
};

export const getLessons = async (params: { difficulty?: string, category?: string }, token: string) => {
  const config = { 
    headers: { Authorization: `Bearer ${token}` },
    params
  };
  const res = await axios.get(`${API_URL}/lessons`, config);
  return res.data;
};

export const getLessonById = async (id: string, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/lesson/${id}`, config);
  return res.data;
};

export const toggleFavorite = async (id: string, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/favorite/${id}`, {}, config);
  return res.data;
};

export const logSession = async (data: any, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/log`, data, config);
  return res.data;
};

export const getSessionLogs = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/logs`, config);
  return res.data;
};
