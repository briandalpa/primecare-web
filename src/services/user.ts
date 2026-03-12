import { axiosInstance } from '@/lib/axiosInstance';
import type { AxiosResponse } from 'axios';
import type { UserRole } from '@/utils/auth';

export interface StaffInfo {
  role: Exclude<UserRole, 'CUSTOMER'>;
  workerType: string | null;
  outletId: string | null;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  image: string | null;
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
  staff: StaffInfo | null;
}

export const getMyProfile = () =>
  axiosInstance
    .get<{ data: UserProfile }>('/api/v1/users/me')
    .then((r: AxiosResponse<{ data: UserProfile }>) => r.data.data);
