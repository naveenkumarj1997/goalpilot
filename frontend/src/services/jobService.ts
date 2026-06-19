import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/`;

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return { headers: { Authorization: `Bearer ${user.token}` } };
  }
  return {};
};

const jobService = {
  getPreferences: async () => {
    const res = await axios.get(API_URL + 'preferences', getAuthHeaders());
    return res.data;
  },
  updatePreferences: async (data: any) => {
    const res = await axios.put(API_URL + 'preferences', data, getAuthHeaders());
    return res.data;
  },
  getJobs: async (params?: any) => {
    const res = await axios.get(API_URL + 'search', { params, ...getAuthHeaders() });
    return res.data;
  },
  getAnalytics: async () => {
    const res = await axios.get(API_URL + 'analytics', getAuthHeaders());
    return res.data;
  },
  getUserJobStates: async () => {
    const res = await axios.get(API_URL + 'state', getAuthHeaders());
    return res.data;
  },
  updateUserJobState: async (jobId: string, status: string) => {
    const res = await axios.post(API_URL + 'state', { jobId, status }, getAuthHeaders());
    return res.data;
  },
  removeUserJobState: async (id: string) => {
    const res = await axios.delete(API_URL + `state/${id}`, getAuthHeaders());
    return res.data;
  },
  getSources: async () => {
    const res = await axios.get(API_URL + 'sources', getAuthHeaders());
    return res.data;
  },
  addSource: async (data: any) => {
    const res = await axios.post(API_URL + 'sources', data, getAuthHeaders());
    return res.data;
  },
  removeSource: async (id: string) => {
    const res = await axios.delete(API_URL + `sources/${id}`, getAuthHeaders());
    return res.data;
  },
  triggerScan: async () => {
    const res = await axios.post(API_URL + 'scan', {}, getAuthHeaders());
    return res.data;
  },
  exportJobsToSheet: async (data: { title: string, location: string, webhookUrl: string }) => {
    const res = await axios.post(API_URL + 'export-to-sheet', data, getAuthHeaders());
    return res.data;
  },
  getKeywords: async () => {
    const res = await axios.get(API_URL + 'keywords', getAuthHeaders());
    return res.data;
  },
  addKeyword: async (data: { keyword: string }) => {
    const res = await axios.post(API_URL + 'keywords', data, getAuthHeaders());
    return res.data;
  },
  removeKeyword: async (id: string) => {
    const res = await axios.delete(API_URL + `keywords/${id}`, getAuthHeaders());
    return res.data;
  }
};

export default jobService;
