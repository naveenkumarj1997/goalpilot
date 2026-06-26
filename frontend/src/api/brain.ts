const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getBrainProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/brain/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch brain profile');
  }

  return response.json();
};

export const setupBrainProfile = async (token: string, data: any) => {
  const response = await fetch(`${API_URL}/brain/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to setup brain profile');
  }

  return response.json();
};

export const getDecks = async (token: string) => {
  const response = await fetch(`${API_URL}/brain/decks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch decks');
  return response.json();
};

export const createDeck = async (token: string, data: any) => {
  const response = await fetch(`${API_URL}/brain/decks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create deck');
  return response.json();
};

export const autoGenerateCards = async (token: string, deckId: string, text: string) => {
  const response = await fetch(`${API_URL}/brain/flashcards/auto-generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ deckId, text }),
  });
  if (!response.ok) throw new Error('Failed to auto generate cards');
  return response.json();
};

export const getDueCards = async (token: string, deckId: string) => {
  const response = await fetch(`${API_URL}/brain/flashcards/due/${deckId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch due cards');
  return response.json();
};

export const reviewCard = async (token: string, cardId: string, quality: number) => {
  const response = await fetch(`${API_URL}/brain/flashcards/${cardId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ quality }),
  });
  if (!response.ok) throw new Error('Failed to review card');
  return response.json();
};
