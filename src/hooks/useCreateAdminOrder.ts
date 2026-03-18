import { useMutation } from '@tanstack/react-query'
import { createAdminOrder } from '@/services/adminOrder'

export const useCreateAdminOrder = () => {
  return useMutation({
    mutationFn: createAdminOrder,
  })
}
