import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/auth/`;

const register = async (userData: any) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData: any) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = async (token: string) => {
  const response = await axios.get(API_URL + 'me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.data) {
    const userStr = localStorage.getItem('user');
    const oldUser = userStr ? JSON.parse(userStr) : {};
    const updatedUser = { ...oldUser, ...response.data, token };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
};

const updateSettings = async (settingsData: any) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  
  const response = await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/users/settings`, settingsData, {
    headers: { Authorization: `Bearer ${user.token}` }
  });
  
  if (response.data) {
    const updatedUser = { ...user, ...response.data, token: user.token };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSettings,
};

export default authService;
