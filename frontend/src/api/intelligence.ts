import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/intelligence`;

export const getIntelligenceItems = async (token: string, category: string, search: string, page: number) => {
  const { data } = await axios.get(`${API_URL}?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}&page=${page}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const getBookmarks = async (token: string) => {
  const { data } = await axios.get(`${API_URL}/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const toggleBookmark = async (token: string, itemId: string) => {
  const { data } = await axios.post(`${API_URL}/bookmarks/${itemId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const triggerAggregation = async (token: string) => {
  const { data } = await axios.post(`${API_URL}/aggregate`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
