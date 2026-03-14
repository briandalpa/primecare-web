import { axiosInstance } from "@/lib/axiosInstance"

export type User = {
  id: string
  name: string
  email: string
  role: string
  emailVerified?: boolean
  createdAt?: string
  outlet?: {
    id: string
    name: string
  } | null
}

export type GetUsersParams = {
  page?: number
  limit?: number
  search?: string
  role?: string
  outletId?: string
}

export type GetUsersResponse = {
  status: string
  message: string
  data: User[]
}

export const getUsers = async (
  params: GetUsersParams
): Promise<GetUsersResponse> => {
  const res = await axiosInstance.get("/admin/users", {
    params,
  })

  return res.data
}