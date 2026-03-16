import { useMutation } from "@tanstack/react-query";
import { createAdminOrder } from "@/services/adminCreateOrder";

export const useCreateAdminOrder = () => {
  return useMutation({
    mutationFn: createAdminOrder,
  });
};