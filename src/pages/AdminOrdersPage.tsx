import { useState } from "react"
import { useAdminOrders } from "@/hooks/useAdminOrders"
import { useNavigate } from "react-router-dom"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Order = {
  id: string
  totalPrice: number
  totalWeightKg: number
  createdAt: string
  outlet?: {
    name?: string
  }
}

export default function AdminOrdersPage() {

  const [page, setPage] = useState(1)

  const navigate = useNavigate()

  const { data, isLoading } = useAdminOrders(page)

  if (isLoading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading orders...
      </div>
    )
  }

  const orders: Order[] = data?.data || []
  const meta = data?.meta

  return (
    <div className="p-6 bg-background text-foreground space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">

        <Table>

          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Weight (Kg)</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  No orders found
                </TableCell>
              </TableRow>
            )}

            {orders.map((order) => (
              <TableRow
                key={order.id}
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                className="cursor-pointer hover:bg-muted transition"
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.outlet?.name}</TableCell>
                <TableCell>Rp {order.totalPrice}</TableCell>
                <TableCell>{order.totalWeightKg}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>

        </Table>

      </div>

      <div className="flex items-center gap-4">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="text-primary disabled:text-muted-foreground"
        >
          Prev
        </button>

        <span className="text-muted-foreground">
          Page {meta?.page || 1}
        </span>

        <button
          disabled={!meta?.totalPages || page === meta.totalPages}
          onClick={() => setPage(page + 1)}
          className="text-primary disabled:text-muted-foreground"
        >
          Next
        </button>

      </div>

    </div>
  )
}