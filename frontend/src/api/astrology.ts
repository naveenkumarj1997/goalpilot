import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAstrologyProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/astrology/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createOrUpdateAstrologyProfile = async (token: string, data: any) => {
  const response = await axios.post(`${API_URL}/astrology/profile`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteAstrologyProfile = async (token: string, id: string) => {
  const response = await axios.delete(`${API_URL}/astrology/profile/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const searchCities = async (token: string, query: string) => {
  const response = await axios.get(`${API_URL}/astrology/cities?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getTodayHoroscope = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/astrology/today?profileId=${profileId}` : `${API_URL}/astrology/today`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCurrentDaysHoroscope = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/astrology/current-days?profileId=${profileId}` : `${API_URL}/astrology/current-days`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};


export const getDashaPeriods = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/astrology/dasha?profileId=${profileId}` : `${API_URL}/astrology/dasha`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getTransitInterpretations = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/astrology/transit?profileId=${profileId}` : `${API_URL}/astrology/transit`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const calculateMatch = async (token: string, partnerData: any, profileId?: string) => {
  const url = profileId ? `${API_URL}/astrology/match?profileId=${profileId}` : `${API_URL}/astrology/match`;
  const response = await axios.post(url, partnerData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
