import axios from 'axios';
import type { GameStat, MatchHistory } from '../types/game';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/games/`;

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  }
  return {};
};

const getLeaderboard = async (): Promise<GameStat[]> => {
  const response = await axios.get(API_URL + 'leaderboard', getAuthHeaders());
  return response.data;
};

const getMyStats = async (): Promise<GameStat> => {
  const response = await axios.get(API_URL + 'stats', getAuthHeaders());
  return response.data;
};

const getMyHistory = async (): Promise<MatchHistory[]> => {
  const response = await axios.get(API_URL + 'history', getAuthHeaders());
  return response.data;
};

const gameService = {
  getLeaderboard,
  getMyStats,
  getMyHistory,
};

export default gameService;
