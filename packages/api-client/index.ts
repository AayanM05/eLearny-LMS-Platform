import axios from 'axios';
import type { Course, UserSummary, AuthResponse, LoginRequest, RegisterRequest, Enrollment, Review, Certificate } from '@elearny/types';

declare const process: any;

const API_BASE_URL = (typeof process !== 'undefined' && process?.env?.VITE_API_URL) || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('elearny_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => (await apiClient.post('/api/auth/login', credentials)).data,
  register: async (data: RegisterRequest): Promise<AuthResponse> => (await apiClient.post('/api/auth/register', data)).data,
  me: async (): Promise<UserSummary> => (await apiClient.get('/api/auth/me')).data,
};

export const courseApi = {
  listPublished: async (page = 0, size = 10) => (await apiClient.get('/api/courses', { params: { page, size } })).data,
  getById: async (id: number): Promise<Course> => (await apiClient.get(`/api/courses/${id}`)).data,
  create: async (data: any): Promise<Course> => (await apiClient.post('/api/courses', data)).data,
};

export const enrollmentApi = {
  myEnrollments: async (): Promise<Enrollment[]> => (await apiClient.get('/api/enrollments/me')).data,
  enrollFree: async (courseId: number): Promise<Enrollment> => (await apiClient.post(`/api/courses/${courseId}/enroll-free`)).data,
};

