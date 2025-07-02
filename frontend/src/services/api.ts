import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AdminRegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Token storage functions
const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

// API functions
const login = async (email: string, password: string, isAdmin = false): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await apiClient.post('/login', {
    email,
    password,
  });
  console.log('Raw API response:', response.data);
  const { access_token, refresh_token } = response.data;
  setTokens(access_token, refresh_token);
  return response.data;
};

const register = async (email: string, password: string, firstName: string, lastName: string): Promise<RegisterResponse> => {
  const response: AxiosResponse<RegisterResponse> = await apiClient.post('/register', {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });

  const { access_token, refresh_token } = response.data;
  setTokens(access_token, refresh_token);

  return response.data;
};

export const registerAdmin = async (data: AdminRegisterRequest) => {
  const response = await apiClient.post("/admin/register", data);
  return response.data;
};

// in api.ts
export const getUserProfile = async () => {
  const res = await apiClient.get('/user/profile');
  return res.data;
};

export const getAdminDashboard = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

const refreshAccessToken = async (): Promise<{ access_token: string }> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response: AxiosResponse<{ access_token: string }> = await apiClient.post('/refresh', {
    refresh_token: refreshToken,
  });

  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data.access_token);
  return response.data;
};

export const updateUserProfile = async (data: {
  first_name?: string;
  last_name?: string;
  email?: string;
}) => {
  const res = await apiClient.put('/user/profile', data);
  return res.data;
};

export const authApi = {
  login,
  register,
  getUserProfile,
  getAdminDashboard,
  refreshAccessToken,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  registerAdmin,
  updateUserProfile
};

export type { User, LoginResponse, RegisterResponse };
