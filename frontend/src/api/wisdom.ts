import axios from 'axios';

const API_URL = 'http://localhost:5000/api/wisdom';

export const getWisdomBooks = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/books`, config);
  return res.data;
};

export const getWisdomBookById = async (id: string, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/books/${id}`, config);
  return res.data;
};

export const getWisdomProfile = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/profile`, config);
  return res.data;
};

export const updateLanguagePref = async (lang: 'en' | 'ta', token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(`${API_URL}/profile/language`, { lang }, config);
  return res.data;
};

export const markLessonLearnedAPI = async (bookId: string, lessonNumber: number, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(`${API_URL}/profile/lesson`, { bookId, lessonNumber }, config);
  return res.data;
};

// Admin Endpoints
export const createWisdomBook = async (bookData: any, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/books`, bookData, config);
  return res.data;
};

export const updateWisdomBook = async (id: string, bookData: any, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(`${API_URL}/books/${id}`, bookData, config);
  return res.data;
};

export const deleteWisdomBook = async (id: string, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.delete(`${API_URL}/books/${id}`, config);
  return res.data;
};
