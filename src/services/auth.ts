import { axiosInstance } from "@/lib/axiosInstance"
import type { AxiosResponse } from 'axios';
import type { RegisterRequest, RegisterResponse, SetPasswordRequest, AuthResponse } from '@/types/auth';

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
