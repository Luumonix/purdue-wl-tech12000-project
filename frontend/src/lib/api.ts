import axios from 'axios';

// Dynamically determine API URL at request time
const getApiUrl = () => {
  // If NEXT_PUBLIC_API_URL is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // If running in browser, detect from window location
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // If on production domain, use production API with same protocol
    if (hostname === 'purdue-tech120-dev.ishmeet.net') {
      return `${protocol}//api.purdue-tech120-dev.ishmeet.net`;
    }
  }
  
  // Default to localhost
  return 'http://localhost:8000';
};

// Helper to make requests with dynamic baseURL
const makeRequest = async (method: string, endpoint: string, data?: any, config?: any) => {
  const baseURL = getApiUrl();
  const url = `${baseURL}${endpoint}`;
  console.log('[API] Making request to:', url);
  
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(config?.headers || {})
  };
  
  return axios({
    method,
    url,
    data,
    ...config,
    headers
  });
};

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await makeRequest('post', '/api/auth/register', { username, email, password });
    return response.data;
  },
  
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await makeRequest('post', '/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await makeRequest('get', '/api/auth/me');
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
    
    const response = await makeRequest('get', `/api/questions/random?${params.toString()}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await makeRequest('get', '/api/questions/categories');
    return response.data;
  },
  
  submitAnswer: async (questionId: number, selectedAnswer: string, timeTaken?: number) => {
    const response = await makeRequest('post', '/api/questions/submit', {
      question_id: questionId,
      selected_answer: selectedAnswer,
      time_taken: timeTaken,
    });
    return response.data;
  },
  
  getStats: async () => {
    const response = await makeRequest('get', '/api/questions/stats');
    return response.data;
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async (limit: number = 10) => {
    const response = await makeRequest('get', `/api/leaderboard?limit=${limit}`);
    return response.data;
  },
  
  getMyRank: async () => {
    const response = await makeRequest('get', '/api/leaderboard/me');
    return response.data;
  },
};

export default axios;
