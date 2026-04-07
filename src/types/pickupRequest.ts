export type PickupRequestPayload = {
  addressId: string
  scheduledAt: string
}

export type PickupRequestOutlet = {
  id: string
  name: string
  address: string
  city: string
  province: string
  latitude: number
  longitude: number
}

export type PickupRequestResponse = {
  id: string
  customerId: string
  addressId: string
  outletId: string
  scheduledAt: string
  status: 'PENDING'
  createdAt: string
  outlet: PickupRequestOutlet
}
