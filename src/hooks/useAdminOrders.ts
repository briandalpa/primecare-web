import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "@/services/adminOrder";

export const useAdminOrders = (page: number) => {
  return useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => getAdminOrders(page),
  });
};