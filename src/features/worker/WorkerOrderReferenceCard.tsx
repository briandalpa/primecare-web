import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WorkerOrderDetailItem } from '@/types/worker-order';
import { WORKER_COPY } from '@/utils/worker';

type WorkerOrderReferenceCardProps = {
  items: WorkerOrderDetailItem[];
};

export function WorkerOrderReferenceCard({ items }: WorkerOrderReferenceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{WORKER_COPY.processOrderReferenceTitle}</CardTitle>
        <CardDescription>{WORKER_COPY.processOrderReferenceDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{WORKER_COPY.processOrderItemLabel}</TableHead>
              <TableHead>{WORKER_COPY.processOrderReferenceQuantity}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.laundryItemId}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
