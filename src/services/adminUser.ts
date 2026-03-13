import { axiosInstance } from "@/lib/axiosInstance"

export type User = {
  id: string
  name: string
  email: string
  role: string
  outlet?: {
    id: string
    name: string
  }
}

export type GetUsersParams = {
  page?: number
  limit?: number
  search?: string
  role?: string
  outletId?: string
}

export const getUsers = async (params: GetUsersParams) => {
  const res = await axiosInstance.get("/admin/users", { params })
  return res.data
}