import axios from 'axios';

// Dynamically determine API URL based on current environment
const getApiUrl = () => {
  // If NEXT_PUBLIC_API_URL is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('[API] Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // If running in browser, detect from window location
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    console.log('[API] Browser detected - protocol:', protocol, 'hostname:', hostname);
    
    // If on production domain, use production API
    if (hostname === 'purdue-tech120-dev.ishmeet.net') {
      const apiUrl = `${protocol}//api.purdue-tech120-dev.ishmeet.net`;
      console.log('[API] Using production API:', apiUrl);
      return apiUrl;
    }
  }
  
  // Default to localhost
  console.log('[API] Using default localhost');
  return 'http://localhost:8000';
};

const API_URL = getApiUrl();
console.log('[API] Final API_URL:', API_URL);

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
