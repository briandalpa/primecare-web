import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
} from '@/services/address'
import type { AddressPayload } from '@/types/address'

const QUERY_KEY = ['addresses']

export const useAddresses = () =>
  useQuery({ queryKey: QUERY_KEY, queryFn: getAddresses })

export const useCreateAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddressPayload) => createAddress(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export const useUpdateAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddressPayload }) =>
      updateAddress(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export const useDeleteAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export const useSetPrimaryAddress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => setPrimaryAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
