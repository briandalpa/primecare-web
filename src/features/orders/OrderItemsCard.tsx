import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
type DisplayItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice?: number | null;
  lineTotal?: number | null;
  isManualPriced?: boolean;
}

export default function OrderItemsCard({ items }: { items?: DisplayItem[] }) {
  if (!items?.length) return null;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.name}
                  {item.isManualPriced && (
                    <span className="ml-2 text-xs text-muted-foreground">(manual)</span>
                  )}
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {item.lineTotal != null ? `Rp ${item.lineTotal.toLocaleString('id-ID')}` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
