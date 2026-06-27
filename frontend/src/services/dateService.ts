import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/dates/`;

// Helper to get auth header
const getAuthHeader = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export interface SavedDate {
  _id: string;
  title: string;
  targetDate: string;
  type: 'Age' | 'Event';
  createdAt?: string;
}

const getDates = async (): Promise<SavedDate[]> => {
  const response = await axios.get(API_URL.slice(0, -1), { headers: getAuthHeader() }); // API_URL is /api/dates
  return response.data;
};

const dateService = {
  getDates,
};

export default dateService;
