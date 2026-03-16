import { useQuery } from "@tanstack/react-query";
import { getAdminOrderDetail } from "@/services/adminOrderDetail";

export const useAdminOrderDetail = (id: string) => {
  return useQuery({
    queryKey: ["admin-order-detail", id],
    queryFn: () => getAdminOrderDetail(id),
    enabled: !!id,
  });
};