import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/astrology`;

export const getAstrologyProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createOrUpdateAstrologyProfile = async (token: string, data: any) => {
  const response = await axios.post(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteAstrologyProfile = async (token: string, id: string) => {
  const response = await axios.delete(`${API_URL}/profile/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const searchCities = async (token: string, query: string) => {
  const response = await axios.get(`${API_URL}/cities?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getTodayHoroscope = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/today?profileId=${profileId}` : `${API_URL}/today`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCurrentDaysHoroscope = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/current-days?profileId=${profileId}` : `${API_URL}/current-days`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};


export const getDashaPeriods = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/dasha?profileId=${profileId}` : `${API_URL}/dasha`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getTransitInterpretations = async (token: string, profileId?: string) => {
  const url = profileId ? `${API_URL}/transit?profileId=${profileId}` : `${API_URL}/transit`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const calculateMatch = async (token: string, partnerData: any, profileId?: string) => {
  const url = profileId ? `${API_URL}/match?profileId=${profileId}` : `${API_URL}/match`;
  const response = await axios.post(url, partnerData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
