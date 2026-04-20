import { axiosInstance } from '@/lib/axiosInstance'
import type { Address, AddressPayload } from '@/types/address'

export const getAddresses = async (): Promise<Address[]> => {
  const res = await axiosInstance.get<{ data: Address[] }>('/api/v1/users/addresses')
  return res.data.data
}

export const createAddress = async (payload: AddressPayload): Promise<Address> => {
  const res = await axiosInstance.post<{ data: Address }>('/api/v1/users/addresses', payload)
  return res.data.data
}

export const updateAddress = async (id: string, payload: AddressPayload): Promise<Address> => {
  const res = await axiosInstance.patch<{ data: Address }>(`/api/v1/users/addresses/${id}`, payload)
  return res.data.data
}

export const deleteAddress = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/v1/users/addresses/${id}`)
}

export const setPrimaryAddress = async (id: string): Promise<Address> => {
  const res = await axiosInstance.patch<{ data: Address }>(`/api/v1/users/addresses/${id}/primary`)
  return res.data.data
}
