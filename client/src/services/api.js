import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/update', data),
  updateSkills: (data) => api.put('/users/skills', data),
  getUserById: (id) => api.get(`/users/${id}`),
  getUsers: (params) => api.get('/users', { params }),
  syncGithub: () => api.post('/users/sync-github'),
};

// Project APIs
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: (params) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getUserProjects: (userId) => api.get(`/projects/user/${userId}`),
};

// GitHub APIs
export const githubAPI = {
  getRepos: (username) => api.get(`/github/repos/${username}`),
  getUserProfile: (username) => api.get(`/github/user/${username}`),
  getUserStats: (username) => api.get(`/github/stats/${username}`),
  getContributions: (username) => api.get(`/github/contributions/${username}`),
  getLanguages: (username) => api.get(`/github/languages/${username}`),
};

// Matching APIs
export const matchAPI = {
  getMatches: (params) => api.get('/match/users', { params }),
  getComplementary: (params) => api.get('/match/complementary', { params }),
  getUsersBySkill: (skillName, params) => api.get(`/match/skill/${skillName}`, { params }),
  calculateMatch: (data) => api.post('/match/calculate', data),
};

// Analytics APIs
export const analyticsAPI = {
  getTrustScore: () => api.get('/analytics/score'),
  getSkillsAnalytics: () => api.get('/analytics/skills'),
  getActivityTimeline: () => api.get('/analytics/activity'),
  getDashboard: () => api.get('/analytics/dashboard'),
};

// Review APIs
export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  getReviewsGiven: () => api.get('/reviews/given'),
  getReviewsReceived: () => api.get('/reviews/received'),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.put(`/reviews/${id}/helpful`),
};

export default api;
