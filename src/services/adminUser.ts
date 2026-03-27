import { axiosInstance } from '@/lib/axiosInstance'
import type {
  User,
  GetUsersParams,
  GetUsersResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from '@/types/user'

export type { User, GetUsersParams, GetUsersResponse, CreateUserPayload, UpdateUserPayload }

export const getUsers = async (params: GetUsersParams): Promise<GetUsersResponse> => {
  const res = await axiosInstance.get('/api/v1/admin/users', { params })
  return res.data
}

export const createUser = async (payload: CreateUserPayload) => {
  const res = await axiosInstance.post('/api/v1/admin/users', payload)
  return res.data
}

export const updateUser = async (userId: string, payload: UpdateUserPayload) => {
  const res = await axiosInstance.patch(`/api/v1/admin/users/${userId}`, payload)
  return res.data
}

export const deleteUser = async (userId: string) => {
  const res = await axiosInstance.delete(`/api/v1/admin/users/${userId}`)
  return res.data
}
