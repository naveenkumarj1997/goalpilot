import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/wealth` : '/api/wealth';

const getHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getWealthProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, getHeaders(token));
  return response.data;
};

export const updateWealthProfile = async (data: any, token: string) => {
  const response = await axios.put(`${API_URL}/profile`, data, getHeaders(token));
  return response.data;
};

export const getDreams = async (token: string) => {
  const response = await axios.get(`${API_URL}/dreams`, getHeaders(token));
  return response.data;
};

export const createDream = async (data: any, token: string) => {
  const response = await axios.post(`${API_URL}/dreams`, data, getHeaders(token));
  return response.data;
};

export const updateDream = async (id: string, data: any, token: string) => {
  const response = await axios.put(`${API_URL}/dreams/${id}`, data, getHeaders(token));
  return response.data;
};



export const deleteDream = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/dreams/${id}`, getHeaders(token));
  return response.data;
};

export const getNetWorthHistory = async (token: string) => {
  const response = await axios.get(`${API_URL}/net-worth`, getHeaders(token));
  return response.data;
};

export const addNetWorthEntry = async (data: any, token: string) => {
  const response = await axios.post(`${API_URL}/net-worth`, data, getHeaders(token));
  return response.data;
};

// AI Advisor
export const getAIDreamAdvice = async (token: string) => {
  const response = await axios.get(`${API_URL}/advisor`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Bucket List
export const getBucketList = async (token: string) => {
  const response = await axios.get(`${API_URL}/bucket-list`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createBucketListItem = async (data: any, token: string) => {
  const response = await axios.post(`${API_URL}/bucket-list`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateBucketListItem = async (id: string, data: any, token: string) => {
  const response = await axios.put(`${API_URL}/bucket-list/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteBucketListItem = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/bucket-list/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
