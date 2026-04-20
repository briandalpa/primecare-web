import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { createUser } from '@/services/adminUser'
import type { CreateUserPayload } from '@/types/user'

export const useCreateUser = (onSuccess: () => Promise<void> | void) => {
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: async () => {
      await onSuccess()
      toast.success('User created successfully')
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined

      toast.error(message || 'Failed to create user')
    },
  })
}
