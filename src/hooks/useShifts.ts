import { useQuery } from '@tanstack/react-query';
import { getShifts } from '@/services/shift';
import type { ShiftListParams } from '@/types/shift';

export const useShifts = (params: ShiftListParams) => {
  return useQuery({
    queryKey: ['shifts', params],
    queryFn: () => getShifts(params),
    staleTime: 30_000,
  });
};
