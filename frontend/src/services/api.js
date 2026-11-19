import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Demo user details (fixed demo identity)
export const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Dev',
  age: 22,
  college: 'IIT Bombay',
  city: 'Mumbai',
  photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
};

/**
 * Fetch profiles that have not been swiped yet.
 */
export const fetchFeed = async () => {
  const response = await api.get('/feed');
  return response.data;
};

/**
 * Send a swipe action (like or pass) on a profile.
 * @param {string} profileId
 * @param {'like' | 'pass'} action
 */
export const sendSwipe = async (profileId, action) => {
  const response = await api.post('/swipe', {
    profileId,
    action,
    userId: DEMO_USER.id,
  });
  return response.data;
};

/**
 * Fetch all confirmed mutual matches.
 */
export const fetchMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

/**
 * Helper to reset demo feed and swipes (testing convenience).
 */
export const resetFeed = async () => {
  const response = await api.post('/matches/reset', {
    userId: DEMO_USER.id,
  });
  return response.data;
};

export default api;

