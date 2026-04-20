import { axiosInstance } from '@/lib/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { UserProfile } from '@/types/user'

export type { UserProfile, StaffInfo } from '@/types/user'

export const getMyProfile = () =>
  axiosInstance
    .get<{ data: UserProfile }>('/api/v1/users/me')
    .then((r: AxiosResponse<{ data: UserProfile }>) => r.data.data)
