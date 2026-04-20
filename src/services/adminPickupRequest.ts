import { axiosInstance } from "@/lib/axiosInstance"

export const getAdminPickupRequests = async () => {
  const response = await axiosInstance.get("/api/v1/admin/pickup-requests");
  return response.data;
};