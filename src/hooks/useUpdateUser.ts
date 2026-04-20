import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { updateUser } from '@/services/adminUser'
import type { UpdateUserPayload } from '@/types/user'

type MutationArgs = { userId: string; payload: UpdateUserPayload }

export const useUpdateUser = (onSuccess: () => Promise<void> | void) => {
  return useMutation({
    mutationFn: ({ userId, payload }: MutationArgs) => updateUser(userId, payload),
    onSuccess: async () => {
      await onSuccess()
      toast.success('User updated successfully')
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined

      toast.error(message || 'Failed to update user')
    },
  })
}
