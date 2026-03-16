// ─── Role ────────────────────────────────────────────────────────────────────

export type UserRole =
  | 'CUSTOMER'
  | 'SUPER_ADMIN'
  | 'OUTLET_ADMIN'
  | 'WORKER'
  | 'DRIVER'

// ─── Current-user profile (GET /api/v1/users/me) ─────────────────────────────

export interface StaffInfo {
  role: Exclude<UserRole, 'CUSTOMER'>
  workerType: string | null
  outletId: string | null
  isActive: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role: UserRole
  image: string | null
  avatarUrl: string | null
  phone: string | null
  createdAt: string
  staff: StaffInfo | null
}

// ─── Admin user list (GET /admin/users) ──────────────────────────────────────

export type User = {
  id: string
  name: string
  email: string
  role: string
  emailVerified?: boolean
  createdAt?: string
  outlet?: { id: string; name: string } | null
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

// ─── Admin user mutations ─────────────────────────────────────────────────────

export type StaffRole = 'OUTLET_ADMIN' | 'WORKER' | 'DRIVER'

export type CreateUserPayload = {
  name: string
  email: string
  role: StaffRole
  outletId?: string
}

export type UpdateUserPayload = {
  role?: StaffRole
  outletId?: string
  isActive?: boolean
}
