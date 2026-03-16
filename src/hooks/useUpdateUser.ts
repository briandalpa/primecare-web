import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateUser } from '@/services/adminUser'
import type { UpdateUserPayload } from '@/types/user'

type MutationArgs = { userId: string; payload: UpdateUserPayload }

export const useUpdateUser = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: ({ userId, payload }: MutationArgs) => updateUser(userId, payload),
    onSuccess: () => {
      toast.success('User updated successfully')
      onSuccess()
    },
    onError: () => {
      toast.error('Failed to update user')
    },
  })
}
