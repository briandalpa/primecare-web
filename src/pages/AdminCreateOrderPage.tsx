import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAdminPickupRequests } from "@/hooks/useAdminPickupRequests"
import { useCreateAdminOrder } from "@/hooks/useCreateAdminOrder"

type PickupRequest = {
  id: string
  customerUser?: {
    name?: string
  }
}

export default function AdminCreateOrderPage() {

  const navigate = useNavigate()

  const { data } = useAdminPickupRequests()
  const { mutate, isPending } = useCreateAdminOrder()

  const pickupRequests: PickupRequest[] = data?.data || []

  const [pickupRequestId, setPickupRequestId] = useState("")
  const [pricePerKg, setPricePerKg] = useState(0)
  const [weight, setWeight] = useState(0)

  const totalPrice = pricePerKg * weight

  const handleSubmit = () => {

    if (!pickupRequestId) return

    mutate(
      {
        pickupRequestId,
        pricePerKg,
        totalWeightKg: weight,
      },
      {
        onSuccess: () => {
          navigate("/admin/orders")
        },
      }
    )

  }

  return (
    <div className="p-6 bg-background text-foreground space-y-6 max-w-xl">

      <h1 className="text-2xl font-bold">
        Create Order
      </h1>

      {/* Pickup Request */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          Pickup Request
        </label>

        <select
          className="w-full border border-border bg-background p-2 rounded"
          value={pickupRequestId}
          onChange={(e) => setPickupRequestId(e.target.value)}
        >

          <option value="">
            Select pickup request
          </option>

          {pickupRequests.map((pr) => (
            <option key={pr.id} value={pr.id}>
              {pr.id} - {pr.customerUser?.name}
            </option>
          ))}

        </select>

      </div>

      {/* Price */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          Price per Kg
        </label>

        <input
          type="number"
          className="w-full border border-border bg-background p-2 rounded"
          value={pricePerKg}
          onChange={(e) => setPricePerKg(Number(e.target.value))}
        />

      </div>

      {/* Weight */}
      <div className="space-y-2">

        <label className="text-sm font-medium">
          Weight (Kg)
        </label>

        <input
          type="number"
          className="w-full border border-border bg-background p-2 rounded"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />

      </div>

      {/* Price Preview */}
      <div className="bg-muted p-4 rounded border border-border">

        <p className="font-medium">
          Total Price Preview
        </p>

        <p className="text-lg font-semibold">
          Rp {totalPrice}
        </p>

      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        {isPending ? "Creating..." : "Create Order"}
      </button>

    </div>
  )
}