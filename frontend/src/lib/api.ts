import axios from 'axios';
import type {
  User,
  UserStats,
  FocusSession,
  TreeType,
  AuthResponse,
  RegisterData,
  LoginData,
  CreateSessionData,
  StatsData,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: LoginData) => api.post<AuthResponse>('/auth/login', data),
  getMe: () => api.get<User & { stats: UserStats }>('/auth/me'),
};

// Sessions API
export const sessionsApi = {
  create: (data: CreateSessionData) => api.post<FocusSession>('/sessions', data),
  complete: (id: string, notes?: string) =>
    api.put<FocusSession>(`/sessions/${id}/complete`, { notes }),
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get<{
      sessions: FocusSession[];
      total: number;
      limit: number;
      offset: number;
    }>('/sessions', { params }),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};

// Stats API
export const statsApi = {
  get: () => api.get<UserStats>('/stats'),
  getWeekly: () => api.get<StatsData>('/stats/weekly'),
  getMonthly: () => api.get<StatsData>('/stats/monthly'),
};

// User API
export const userApi = {
  getProfile: () => api.get<User & { stats: UserStats }>('/user/profile'),
  updateProfile: (data: Partial<User>) =>
    api.put<User>('/user/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/user/password', data),
};

export default api;
