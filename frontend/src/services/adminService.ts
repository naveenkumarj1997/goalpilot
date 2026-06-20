const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const headers = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getStats = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/stats`, { headers: headers(token) });
  return res.json();
};

export const getDailyActiveUsers = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/active-users`, { headers: headers(token) });
  return res.json();
};

export const getUsers = async (token: string, params?: { page: number, limit: number, search: string, sortBy: string, sortOrder: string }) => {
  let url = `${API_URL}/admin/users`;
  if (params) {
    const qs = new URLSearchParams();
    if (params.page) qs.append('page', params.page.toString());
    if (params.limit) qs.append('limit', params.limit.toString());
    if (params.search) qs.append('search', params.search);
    if (params.sortBy) qs.append('sortBy', params.sortBy);
    if (params.sortOrder) qs.append('sortOrder', params.sortOrder);
    url += `?${qs.toString()}`;
  }
  const res = await fetch(url, { headers: headers(token) });
  return res.json();
};

export const updateUserStatus = async (id: string, status: string, blockReason: string, token: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}/status`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ status, blockReason })
  });
  return res.json();
};

export const updateUserRole = async (id: string, role: string, token: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ role })
  });
  return res.json();
};

export const getPublicFeatureFlags = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/features/public`, { headers: headers(token) });
  return res.json();
};

export const getFeatureFlags = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/features`, { headers: headers(token) });
  return res.json();
};

export const updateFeatureFlag = async (data: { moduleName: string, isEnabled?: boolean, isPremium?: boolean, maintenanceMode?: boolean, price?: number }, token: string) => {
  const res = await fetch(`${API_URL}/admin/features`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getAuditLogs = async (token: string, params?: { page: number, limit: number, search: string, sortBy: string, sortOrder: string }) => {
  let url = `${API_URL}/admin/audit-logs`;
  if (params) {
    const qs = new URLSearchParams();
    if (params.page) qs.append('page', params.page.toString());
    if (params.limit) qs.append('limit', params.limit.toString());
    if (params.search) qs.append('search', params.search);
    if (params.sortBy) qs.append('sortBy', params.sortBy);
    if (params.sortOrder) qs.append('sortOrder', params.sortOrder);
    url += `?${qs.toString()}`;
  }
  const res = await fetch(url, { headers: headers(token) });
  return res.json();
};

export const getUpgradeRequests = async (token: string, params?: any) => {
  const query = new URLSearchParams(params || {}).toString();
  const res = await fetch(`${API_URL}/admin/upgrades?${query}`, { headers: headers(token) });
  return res.json();
};

export const processUpgradeRequest = async (id: string, status: string, token: string) => {
  const res = await fetch(`${API_URL}/admin/upgrades/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ status })
  });
  return res.json();
};

export const createUpgradeRequest = async (transactionReference: string, moduleName: string, pricePaid: number, token: string) => {
  const res = await fetch(`${API_URL}/admin/upgrade-request`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ transactionReference, moduleName, pricePaid })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error creating request');
  }
  return res.json();
};

export const getSystemConfig = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/config/public`, { headers: headers(token) });
  return res.json();
};

export const updateSystemConfig = async (key: string, value: string, token: string) => {
  const res = await fetch(`${API_URL}/admin/config`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ key, value })
  });
  return res.json();
};

export const updateUserOverrides = async (id: string, overrides: Record<string, boolean>, token: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}/overrides`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ overrides })
  });
  if (!res.ok) throw new Error('Failed to update overrides');
  return res.json();
};

export const getSupportConversations = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/support/conversations`, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
};

export const replyToSupportMessage = async (userId: string, text: string, token: string) => {
  const res = await fetch(`${API_URL}/admin/support/conversations/${userId}/reply`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to send reply');
  return res.json();
};

export const getPremiumPurchases = async (token: string, params?: { page: number, limit: number, search: string, sortBy: string, sortOrder: string }) => {
  let url = `${API_URL}/admin/premium-purchases`;
  if (params) {
    const qs = new URLSearchParams();
    if (params.page) qs.append('page', params.page.toString());
    if (params.limit) qs.append('limit', params.limit.toString());
    if (params.search) qs.append('search', params.search);
    if (params.sortBy) qs.append('sortBy', params.sortBy);
    if (params.sortOrder) qs.append('sortOrder', params.sortOrder);
    url += `?${qs.toString()}`;
  }
  const res = await fetch(url, { headers: headers(token) });
  return res.json();
};
