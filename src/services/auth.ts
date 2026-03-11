import { axiosInstance } from '@/lib/axiosInstance';
import type { AxiosResponse } from 'axios';

interface RegisterRequest {
  name: string;
  email: string;
}

interface RegisterResponse {
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: 'CUSTOMER';
  };
}

interface SetPasswordRequest {
  token: string;
  password: string;
}

interface AuthResponse {
  status: string;
  message: string;
}

export const registerUser = (data: RegisterRequest) =>
  axiosInstance
    .post<RegisterResponse>('/api/v1/users/register', data)
    .then((r: AxiosResponse<RegisterResponse>) => r.data);

export const resendVerificationEmail = (email: string) =>
  axiosInstance
    .post<AuthResponse>('/api/v1/users/resend-verification', { email })
    .then((r: AxiosResponse<AuthResponse>) => r.data);

export const setPassword = (data: SetPasswordRequest) =>
  axiosInstance
    .post<AuthResponse>('/api/v1/users/set-password', data)
    .then((r: AxiosResponse<AuthResponse>) => r.data);
