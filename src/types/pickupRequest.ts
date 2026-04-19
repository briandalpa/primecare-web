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

export type PickupStatus = 'PENDING' | 'DRIVER_ASSIGNED' | 'PICKED_UP' | 'CANCELLED'

export type PickupRequestResponse = {
  id: string
  customerId: string
  addressId: string
  outletId: string
  scheduledAt: string
  status: PickupStatus
  createdAt: string
  outlet: PickupRequestOutlet
}

export type CustomerPickupRequest = {
  id: string
  outletName: string
  scheduledAt: string
  status: PickupStatus
  createdAt: string
}
