import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/nofap`;

// Get or Create Profile
export const getProfile = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

// Update Target Goal
export const updateTargetGoal = async (targetGoal: number, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.put(`${API_URL}/target`, { targetGoal }, config);
  return response.data;
};

// Daily Check-in
export const dailyCheckIn = async (success: boolean, token: string, date?: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}/checkin`, { success, date }, config);
  return response.data;
};

// Get Logs
export const getLogs = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/logs`, config);
  return response.data;
};

// Add Journal Entry
export const addJournalEntry = async (entry: { mood: string, energy: string, motivation: string, notes: string }, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(`${API_URL}/journal`, entry, config);
  return response.data;
};

// Get Journal Entries
export const getJournalEntries = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/journal`, config);
  return response.data;
};

// Get Daily Motivation
export const getMotivation = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(`${API_URL}/motivation`, config);
  return response.data;
};
