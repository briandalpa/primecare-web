import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'
import { createAdminOrder } from '@/services/adminOrder'

export const useCreateAdminOrder = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: createAdminOrder,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['admin-pickup-requests', session?.user?.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['admin-orders'],
        }),
      ])
    },
  })
}
