import { useParams, useNavigate } from "react-router-dom"
import { useAdminOrderDetail } from "@/hooks/useAdminOrderDetail"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderItem = {
  id: string
  quantity: number
  laundryItem: {
    name: string
  }
}

export default function AdminOrderDetailPage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useAdminOrderDetail(id || "")

  if (isLoading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading order detail...
      </div>
    )
  }

  const order = data?.data

  return (
    <div className="p-6 bg-background text-foreground space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">
          Order Detail
        </h1>

        <button
          onClick={() => navigate("/admin/orders")}
          className="text-primary hover:underline"
        >
          ← Back to Orders
        </button>

      </div>

      {/* ORDER INFO */}

      <div className="space-y-2">

        <p><b>Order ID:</b> {order?.id}</p>

        <p><b>Outlet:</b> {order?.outlet?.name}</p>

        <p><b>Total Weight:</b> {order?.totalWeightKg} Kg</p>

        <p><b>Price per Kg:</b> Rp {order?.pricePerKg}</p>

        <p><b>Total Price:</b> Rp {order?.totalPrice}</p>

      </div>

      {/* CUSTOMER */}

      <div className="space-y-2">

        <h2 className="text-lg font-semibold">
          Customer
        </h2>

        <p>
          <b>Name:</b> {order?.pickupRequest?.customerUser?.name}
        </p>

        <p>
          <b>Email:</b> {order?.pickupRequest?.customerUser?.email}
        </p>

      </div>

      {/* ITEMS */}

      <div className="space-y-4">

        <h2 className="text-lg font-semibold">
          Laundry Items
        </h2>

        <div className="rounded-lg border border-border overflow-hidden">

          <Table>

            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {order?.items?.map((item: OrderItem) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.laundryItem.name}
                  </TableCell>
                  <TableCell>
                    {item.quantity}
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>

          </Table>

        </div>

      </div>

    </div>
  )
}