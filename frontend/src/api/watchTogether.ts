import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getPublicRooms = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/api/watch/rooms/public`, config);
  return res.data;
};

export const getMyRooms = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/api/watch/rooms/my`, config);
  return res.data;
};

export const getRoomById = async (token: string, roomId: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/api/watch/rooms/${roomId}`, config);
  return res.data;
};

export const createRoom = async (token: string, roomData: any) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/api/watch/rooms`, roomData, config);
  return res.data;
};

export const verifyRoomPassword = async (token: string, roomId: string, password?: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/api/watch/rooms/verify`, { roomId, password }, config);
  return res.data;
};

export const endRoom = async (token: string, roomId: string, durationMinutes: number) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/api/watch/rooms/end`, { roomId, durationMinutes }, config);
  return res.data;
};

export const getWatchHistory = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/api/watch/history`, config);
  return res.data;
};

export const searchUsers = async (token: string, query: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/api/watch/users/search?query=${query}`, config);
  return res.data;
};

export const getFriends = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/api/watch/friends`, config);
  return res.data;
};

export const getFriendRequests = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}/api/watch/friends/requests`, config);
  return res.data;
};

export const sendFriendRequest = async (token: string, receiverId: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/api/watch/friends/request`, { receiverId }, config);
  return res.data;
};

export const acceptFriendRequest = async (token: string, requestId: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/api/watch/friends/accept`, { requestId }, config);
  return res.data;
};

export const rejectFriendRequest = async (token: string, requestId: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(`${API_URL}/api/watch/friends/reject`, { requestId }, config);
  return res.data;
};
