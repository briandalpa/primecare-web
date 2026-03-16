import { useQuery } from "@tanstack/react-query";
import { getAdminPickupRequests } from "@/services/adminPickupRequest";

export const useAdminPickupRequests = () => {
  return useQuery({
    queryKey: ["admin-pickup-requests"],
    queryFn: getAdminPickupRequests,
  });
};