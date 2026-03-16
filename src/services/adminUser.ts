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
  const res = await axiosInstance.get('/admin/users', { params })
  return res.data
}

export const createUser = async (payload: CreateUserPayload) => {
  const res = await axiosInstance.post('/admin/users', payload)
  return res.data
}

export const updateUser = async (userId: string, payload: UpdateUserPayload) => {
  const res = await axiosInstance.patch(`/admin/users/${userId}`, payload)
  return res.data
}

export const deleteUser = async (userId: string) => {
  const res = await axiosInstance.delete(`/admin/users/${userId}`)
  return res.data
}
