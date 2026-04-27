import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import type { DisplayRow } from '@/types/driverHistory';

export function HistoryTable({
  rows,
  onSelect,
}: {
  rows: DisplayRow[];
  onSelect: (row: DisplayRow) => void;
}) {
  return (
    <Card className="hidden rounded-2xl border-border/70 shadow-sm md:block px-6 py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="hidden sm:table-cell">Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Address</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelect(row)}
            >
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize text-xs">
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {row.date}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {row.customer}
              </TableCell>
              <TableCell className="hidden max-w-[200px] truncate sm:table-cell text-muted-foreground">
                {row.address}
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-primary/10 text-primary shadow-none">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Eye className="ml-auto h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
