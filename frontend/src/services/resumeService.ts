import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  };
};

export const getResumes = async () => {
  const res = await axios.get(`${API_URL}/resumes`, getAuthHeaders());
  return res.data;
};

export const getResumeById = async (id: string) => {
  const res = await axios.get(`${API_URL}/resumes/${id}`, getAuthHeaders());
  return res.data;
};

export const createResume = async (data: any) => {
  const res = await axios.post(`${API_URL}/resumes`, data, getAuthHeaders());
  return res.data;
};

export const updateResume = async (id: string, data: any) => {
  const res = await axios.put(`${API_URL}/resumes/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteResume = async (id: string) => {
  const res = await axios.delete(`${API_URL}/resumes/${id}`, getAuthHeaders());
  return res.data;
};

export const duplicateResume = async (id: string) => {
  const res = await axios.post(`${API_URL}/resumes/${id}/duplicate`, {}, getAuthHeaders());
  return res.data;
};

// AI Endpoints
export const generateSummary = async (data: any) => {
  const res = await axios.post(`${API_URL}/resumes/ai/summary`, data, getAuthHeaders());
  return res.data.summary;
};

export const enhanceBullet = async (bullet: string, targetRole: string) => {
  const res = await axios.post(`${API_URL}/resumes/ai/enhance-bullet`, { bullet, targetRole }, getAuthHeaders());
  return res.data.bullet;
};

export const categorizeSkills = async (rawSkills: string) => {
  const res = await axios.post(`${API_URL}/resumes/ai/categorize-skills`, { rawSkills }, getAuthHeaders());
  return res.data.skills;
};

export const scanATS = async (resumeData: any) => {
  const res = await axios.post(`${API_URL}/resumes/ai/ats-score`, { resumeData }, getAuthHeaders());
  return res.data;
};
