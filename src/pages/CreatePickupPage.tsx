import { useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useAddresses } from '@/hooks/useAddresses'
import { useCreatePickupRequest } from '@/hooks/usePickupRequest'
import ProtectedButton from '@/features/auth/ProtectedButton'
import PickupAddressSelector from '@/features/customer/PickupAddressSelector'
import PickupScheduleSelector from '@/features/customer/PickupScheduleSelector'
import PickupRequestList from '@/features/customer/PickupRequestList'
import { TIME_SLOTS } from '@/utils/pickupSlots'
import PickupConfirmDialog from '@/features/customer/PickupConfirmDialog'

function buildScheduledAt(date: Date, timeSlot: string): string {
  const slot = TIME_SLOTS.find((s) => s.value === timeSlot)
  const hour = slot?.hour ?? 8
  const scheduled = new Date(date)
  scheduled.setHours(hour, 0, 0, 0)
  return scheduled.toISOString()
}

function toPickupErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.status === 422) {
    return 'No outlet available in your area. Please try a different address.';
  }
  return 'Failed to schedule pickup. Please try again.';
}

export default function CreatePickupPage() {
  const { data: addresses = [] } = useAddresses()
  const mutation = useCreatePickupRequest()

  const defaultAddressId = useMemo(
    () => addresses.find((a) => a.isPrimary)?.id ?? addresses[0]?.id ?? null,
    [addresses],
  )

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const effectiveAddressId = selectedAddressId ?? defaultAddressId
  const selectedAddress = addresses.find((a) => a.id === effectiveAddressId)
  const isValid = !!selectedAddress && !!date && !!timeSlot
  const timeLabel = TIME_SLOTS.find((t) => t.value === timeSlot)?.label ?? ''

  const handleConfirm = async () => {
    if (!selectedAddress || !date || !timeSlot) return
    try {
      const result = await mutation.mutateAsync({
        addressId: selectedAddress.id,
        scheduledAt: buildScheduledAt(date, timeSlot),
      })
      setConfirmOpen(false)
      toast.success(`Pickup scheduled! ${result.outlet.name} will handle your order.`)
    } catch (err: unknown) {
      toast.error(toPickupErrorMessage(err))
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-foreground">
          Schedule a Pickup
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your address, pick a time, and we'll handle the rest
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PickupAddressSelector
            addresses={addresses}
            selectedId={effectiveAddressId}
            onSelect={setSelectedAddressId}
          />
          <PickupScheduleSelector
            date={date}
            setDate={setDate}
            timeSlot={timeSlot}
            setTimeSlot={setTimeSlot}
          />
          <ProtectedButton
            size="lg"
            className="w-full rounded-full text-base font-semibold"
            disabled={!isValid}
            onClick={() => isValid && setConfirmOpen(true)}
          >
            Review & Confirm Pickup
          </ProtectedButton>
        </div>
        <PickupRequestList />
      </div>
      <PickupConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        address={selectedAddress}
        date={date}
        timeLabel={timeLabel}
        isPending={mutation.isPending}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
