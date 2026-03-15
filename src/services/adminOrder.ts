import axiosInstance from "@/lib/axiosInstance"

export const getAdminOrders = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get("/admin/orders", {
    params: { page, limit },
  });

  return response.data;
};