import axiosInstance from "@/lib/axiosInstance"

export const getAdminPickupRequests = async () => {
  const response = await axiosInstance.get("/admin/pickup-requests");
  return response.data;
};