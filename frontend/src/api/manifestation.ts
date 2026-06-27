const API_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

const headers = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getManifestationProfile = async (token: string) => {
  const res = await fetch(`${API_URL}/manifestation/profile`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateManifestationProfile = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/profile`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const getVisionBoard = async (token: string) => {
  const res = await fetch(`${API_URL}/manifestation/vision-board`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch vision board');
  return res.json();
};

export const addVisionBoardItem = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/vision-board`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add vision board item');
  return res.json();
};

export const deleteVisionBoardItem = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/vision-board/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to delete vision board item');
  return res.json();
};

export const getManifestationGoals = async (token: string) => {
  const res = await fetch(`${API_URL}/manifestation/goals`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch goals');
  return res.json();
};

export const addManifestationGoal = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/goals`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || 'Failed to add goal');
  }
  return res.json();
};

export const updateGoal = async (id: string, data: any, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/goals/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update goal');
  return res.json();
};

export const deleteGoal = async (id: string, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/goals/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to delete goal');
  return res.json();
};

export const getManifestationJournals = async (token: string) => {
  const res = await fetch(`${API_URL}/manifestation/journals`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch journals');
  return res.json();
};

export const addManifestationJournal = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/journals`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add journal');
  return res.json();
};

export const getManifestationActivities = async (token: string) => {
  const res = await fetch(`${API_URL}/manifestation/activities`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
};

export const addManifestationActivity = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/activities`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add activity');
  return res.json();
};

export const getAffirmations = async (token: string) => {
  const res = await fetch(`${API_URL}/manifestation/affirmations`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch affirmations');
  return res.json();
};

export const addAffirmation = async (text: string, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/affirmations`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add affirmation');
  return res.json();
};

export const deleteAffirmation = async (text: string, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/affirmations`, {
    method: 'DELETE',
    headers: headers(token),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to delete affirmation');
  return res.json();
};

export const askSuccessCoach = async (message: string, token: string) => {
  const res = await fetch(`${API_URL}/manifestation/coach/ask`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to get coach reply');
  return res.json();
};
