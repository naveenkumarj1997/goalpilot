const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/market`;

export const getMarketOverview = async (token: string) => {
  const response = await fetch(`${API_URL}/overview`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch market overview');
  return response.json();
};

export const getMarketNews = async (token: string, category: string, page: number, filter: string = 'All', limit: number = 5) => {
  const response = await fetch(`${API_URL}/news?category=${category}&page=${page}&filter=${filter}&limit=${limit}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
};

export const getMarketNewsStats = async (token: string) => {
  const response = await fetch(`${API_URL}/news/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch news stats');
  return response.json();
};

export const markMarketNewsRead = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/news/${id}/read`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to mark read');
  return response.json();
};

export const toggleMarketNewsSaved = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/news/${id}/save`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to toggle save');
  return response.json();
};

export const askAiAnalyst = async (token: string, question: string) => {
  const response = await fetch(`${API_URL}/analyst`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  });
  if (!response.ok) throw new Error('Failed to ask AI');
  return response.json();
};

export const getVirtualPortfolio = async (token: string) => {
  const response = await fetch(`${API_URL}/portfolio`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch portfolio');
  return response.json();
};

export const addPortfolioItem = async (token: string, data: any) => {
  const response = await fetch(`${API_URL}/portfolio`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to add portfolio item');
  return response.json();
};

export const triggerMarketSync = async (token: string) => {
  const response = await fetch(`${API_URL}/aggregate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to sync market data');
  return response.json();
};
