import axios from 'axios';
import { signOut } from '@/lib/auth-client';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true,   // required for better-auth cookie-based sessions
})

// Module-level flag prevents multiple concurrent 401 responses from triggering
// duplicate sign-out calls and window.location redirects.
let isRedirecting = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // On 401, sign out via better-auth (clears cookie) then hard-navigate to home.
    // We don't use React Router here because the session may be corrupted.
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      signOut().finally(() => {
        window.location.href = '/';
      });
    }
    return Promise.reject(error);
  },
);
