import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { saveToken, saveUser } from '../utils/auth';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { token, email, fullName } = response.data;
    saveToken(token);
    saveUser(email, fullName);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { token, email, fullName } = response.data;
    saveToken(token);
    saveUser(email, fullName);
    return response.data;
  },
};