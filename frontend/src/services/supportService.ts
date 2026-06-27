const API_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

const headers = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getUserMessages = async (token: string) => {
  const res = await fetch(`${API_URL}/support`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
};

export const sendMessage = async (text: string, token: string) => {
  const res = await fetch(`${API_URL}/support`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
};

export const markAsRead = async (token: string) => {
  const res = await fetch(`${API_URL}/support`, {
    method: 'PUT',
    headers: headers(token)
  });
  if (!res.ok) throw new Error('Failed to mark as read');
  return res.json();
};
