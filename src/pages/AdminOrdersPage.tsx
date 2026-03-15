import { useState } from "react";
import { useAdminOrders } from "@/hooks/useAdminOrders";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Order = {
  id: string;
  totalPrice: number;
  totalWeightKg: number;
  createdAt: string;
  outlet?: {
    name?: string;
  };
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminOrders(page);

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  const orders: Order[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Weight (Kg)</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
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

      <div className="flex gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {meta?.page || 1}
        </span>

        <button
          disabled={!meta?.totalPages || page === meta.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}