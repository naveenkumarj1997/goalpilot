import axios from 'axios';

const API_URL = '/api/astrology/notes';

export interface AstrologyNote {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export const getNotes = async (token: string): Promise<AstrologyNote[]> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

export const createNote = async (
  token: string, 
  noteData: { title: string; content: string; tags: string[]; source?: string }
): Promise<AstrologyNote> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(API_URL, noteData, config);
  return response.data;
};

export const updateNote = async (
  token: string, 
  noteId: string, 
  noteData: { title: string; content: string; tags: string[]; source?: string }
): Promise<AstrologyNote> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.put(`${API_URL}/${noteId}`, noteData, config);
  return response.data;
};

export const deleteNote = async (token: string, noteId: string): Promise<void> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  await axios.delete(`${API_URL}/${noteId}`, config);
};
