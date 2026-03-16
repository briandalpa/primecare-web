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

  // modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const totalPrice = pricePerKg * weight

  const selectedPickup = pickupRequests.find(
    (p) => p.id === pickupRequestId
  )

  const handleCreateClick = () => {

    if (!pickupRequestId) return

    setIsConfirmOpen(true)

  }

  const handleConfirm = () => {

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
        onClick={handleCreateClick}
        disabled={isPending}
        className="bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Create Order
      </button>

      {/* ================= CONFIRM MODAL ================= */}

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-background border border-border rounded-lg p-6 w-[400px] space-y-4">

            <h2 className="text-lg font-semibold">
              Confirm Order
            </h2>

            <div className="space-y-2 text-sm">

              <p>
                <span className="font-medium">Pickup Request:</span>{" "}
                {selectedPickup?.id}
              </p>

              <p>
                <span className="font-medium">Customer:</span>{" "}
                {selectedPickup?.customerUser?.name}
              </p>

              <p>
                <span className="font-medium">Price per Kg:</span>{" "}
                Rp {pricePerKg}
              </p>

              <p>
                <span className="font-medium">Weight:</span>{" "}
                {weight} Kg
              </p>

              <p className="text-base font-semibold pt-2">
                Total: Rp {totalPrice}
              </p>

            </div>

            <div className="flex justify-end gap-3 pt-4">

              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 border border-border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
              >
                {isPending ? "Creating..." : "Confirm Order"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}