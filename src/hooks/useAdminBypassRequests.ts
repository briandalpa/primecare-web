import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminBypassRequests,
  approveBypassRequest,
  rejectBypassRequest,
} from '@/services/adminBypassRequest';
import type { BypassRequest } from '@/types/bypassRequest';

type MutationPayload = {
  id: string;
  password: string;
  problemDescription: string;
};

export const useAdminBypassRequests = () => {
  return useQuery<BypassRequest[]>({
    queryKey: ['admin-bypass-requests'],
    queryFn: getAdminBypassRequests,
  });
};

export const useApproveBypassRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<BypassRequest, Error, MutationPayload>({
    mutationFn: approveBypassRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-bypass-requests'],
      });
    },
  });
};

export const useRejectBypassRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<BypassRequest, Error, MutationPayload>({
    mutationFn: rejectBypassRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-bypass-requests'],
      });
    },
  });
};