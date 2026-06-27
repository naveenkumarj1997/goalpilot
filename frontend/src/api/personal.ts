const API_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

export const getPersonalProfile = async (token: string) => {
  const res = await fetch(`${API_URL}/personal/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch personal profile');
  }
  return res.json();
};

export const createOrUpdatePersonalProfile = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/personal/profile`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save profile');
  return res.json();
};

export const logPersonalActivity = async (data: any, token: string) => {
  const res = await fetch(`${API_URL}/personal/log`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to log activity');
  return res.json();
};

export const getPersonalLogs = async (token: string) => {
  const res = await fetch(`${API_URL}/personal/logs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch personal logs');
  return res.json();
};
