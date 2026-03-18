import { useQuery } from '@tanstack/react-query'
import { getLaundryItems } from '@/services/adminLaundryItem'

export const useLaundryItems = () => {
  return useQuery({
    queryKey: ['laundry-items'],
    queryFn: getLaundryItems,
    staleTime: 10 * 60 * 1000,
  })
}
