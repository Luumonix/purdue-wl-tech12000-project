import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data;
  },
  
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Questions API
export const questionsAPI = {
  getRandomQuestions: async (count: number = 5, category?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    params.append('count', count.toString());
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    const response = await api.get(`/api/questions/random?${params.toString()}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/api/questions/categories');
    return response.data;
  },
  
  submitAnswer: async (questionId: number, selectedAnswer: string, timeTaken?: number) => {
    const response = await api.post('/api/questions/submit', {
      question_id: questionId,
      selected_answer: selectedAnswer,
      time_taken: timeTaken,
    });
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/api/questions/stats');
    return response.data;
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async (limit: number = 10) => {
    const response = await api.get(`/api/leaderboard?limit=${limit}`);
    return response.data;
  },
  
  getMyRank: async () => {
    const response = await api.get('/api/leaderboard/me');
    return response.data;
  },
};

export default api;
