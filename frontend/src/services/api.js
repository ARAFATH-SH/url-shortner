// Default API Base URL (Go backend running on port 8080)
let API_BASE_URL = localStorage.getItem('shortlink_api_url') || 'http://localhost:8080';

export const getApiUrl = () => API_BASE_URL;

export const setApiUrl = (url) => {
  API_BASE_URL = url.endsWith('/') ? url.slice(0, -1) : url;
  localStorage.setItem('shortlink_api_url', API_BASE_URL);
};

// Check backend status
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/urls`, { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
};

// Fetch all URLs
export const fetchUrls = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/urls`);
    if (!res.ok) throw new Error('Failed to fetch URLs');
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.warn('Backend fetch failed, fallback to local cache if needed:', err);
    throw err;
  }
};

// Create a short URL
export const createShortUrl = async (originalUrl) => {
  const res = await fetch(`${API_BASE_URL}/urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ original_url: originalUrl }),
  });

  if (!res.ok) {
    const errorText = await res.json().catch(() => 'Failed to shorten URL');
    throw new Error(typeof errorText === 'string' ? errorText : 'Failed to shorten URL');
  }

  return await res.json();
};

// Delete a short URL
export const deleteShortUrl = async (shortCode) => {
  const res = await fetch(`${API_BASE_URL}/urls/${shortCode}`, {
    method: 'DELETE',
  });

  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete URL');
  }

  return true;
};
