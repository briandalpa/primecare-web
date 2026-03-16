import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createUser } from '@/services/adminUser'
import type { CreateUserPayload } from '@/types/user'

export const useCreateUser = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      toast.success('User created successfully')
      onSuccess()
    },
    onError: () => {
      toast.error('Failed to create user')
    },
  })
}
