import axios, { isAxiosError } from 'axios';
import { signOut } from '@/lib/auth-client';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true,
});

let isRedirecting = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const code = error.response?.data?.code;

      // ONLY logout if truly unauthorized session
      if (status === 401 && code === 'UNAUTHORIZED' && !isRedirecting) {
        isRedirecting = true;
        await signOut();
        window.location.href = '/';
      }

      // ❗ WRONG PASSWORD → DO NOT logout
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);