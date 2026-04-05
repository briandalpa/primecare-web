import { useQuery } from "@tanstack/react-query";
import { getAdminBypassRequests } from "@/services/adminBypassRequest";
import type { BypassRequest } from "@/types/bypassRequest";

export const useAdminBypassRequests = () => {
  return useQuery<BypassRequest[]>({
    queryKey: ["admin-bypass-requests"],
    queryFn: getAdminBypassRequests,
  });
};