import { axiosInstance } from '@/lib/axiosInstance'
import type { Province, City } from '@/types/address'

export const getProvinces = async (): Promise<Province[]> => {
  const res = await axiosInstance.get<{ data: Province[] }>('/api/v1/regions/provinces')
  return res.data.data
}

export const getCitiesByProvince = async (provinceId: number): Promise<City[]> => {
  const res = await axiosInstance.get<{ data: City[] }>(`/api/v1/regions/cities/${provinceId}`)
  return res.data.data
}

export const geocodeAddress = async (
  city: string,
  province: string,
): Promise<{ latitude: number; longitude: number }> => {
  const res = await axiosInstance.get<{ data: { latitude: number; longitude: number } }>('/api/v1/regions/geocode', {
    params: { city, province },
  })
  return res.data.data
}
