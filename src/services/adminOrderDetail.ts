import { axiosInstance } from "@/lib/axiosInstance";

export const getAdminOrderDetail = async (id: string) => {
  const response = await axiosInstance.get(`/admin/orders/${id}`);
  return response.data;
};