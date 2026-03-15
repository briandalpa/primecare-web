import axiosInstance from "@/lib/axiosInstance"

export const createAdminOrder = async (data: {
  pickupRequestId: string;
  pricePerKg: number;
  totalWeightKg: number;
}) => {
  const response = await axiosInstance.post("/admin/orders", data);
  return response.data;
};