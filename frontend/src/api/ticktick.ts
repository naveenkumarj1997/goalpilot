import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

export const getTasks = async (token: string, query?: { startDate?: string; endDate?: string; folder?: string }) => {
  const config = { 
    headers: { Authorization: `Bearer ${token}` },
    params: query
  };
  const response = await axios.get(`${API_URL}/ticktick`, config);
  return response.data;
};

export const getTaskById = async (token: string, id: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/ticktick/${id}`, config);
  return response.data;
};

export const createTask = async (token: string, data: any) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/ticktick`, data, config);
  return response.data;
};

export const updateTask = async (token: string, id: string, updates: any) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/ticktick/${id}`, updates, config);
  return response.data;
};

export const deleteTask = async (token: string, id: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`${API_URL}/ticktick/${id}`, config);
  return response.data;
};
