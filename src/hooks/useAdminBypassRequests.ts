import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminBypassRequests,
  approveBypassRequest,
  rejectBypassRequest,
} from "@/services/adminBypassRequest";
import type { BypassRequest } from "@/types/bypassRequest";

export const useAdminBypassRequests = () => {
  return useQuery<BypassRequest[]>({
    queryKey: ["admin-bypass-requests"],
    queryFn: getAdminBypassRequests,
    staleTime: 30_000, // reviewer note
  });
};

export const useApproveBypassRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { password: string; problemDescription: string };
    }) => approveBypassRequest(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bypass-requests"] });
    },
  });
};

export const useRejectBypassRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { password: string; problemDescription: string };
    }) => rejectBypassRequest(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bypass-requests"] });
    },
  });
};