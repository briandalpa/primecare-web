import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Shift } from '@/types/shift';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const formatWorkerType = (value: string | null) =>
  value ? value.replaceAll('_', ' ') : '-';

type ShiftTableProps = {
  canManage: boolean;
  shifts: Shift[];
  onEnd: (shift: Shift) => void;
};

export function ShiftTable({ canManage, shifts, onEnd }: ShiftTableProps) {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Worker</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Ended</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No shifts found.
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.workerName ?? '-'}</TableCell>
                <TableCell>{formatWorkerType(shift.workerType)}</TableCell>
                <TableCell>{shift.outletName}</TableCell>
                <TableCell>{dateFormatter.format(new Date(shift.startedAt))}</TableCell>
                <TableCell>
                  {shift.endedAt ? dateFormatter.format(new Date(shift.endedAt)) : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={shift.isActive ? 'default' : 'secondary'}>
                    {shift.isActive ? 'Active' : 'Ended'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {canManage && shift.isActive ? (
                    <Button variant="destructive" size="sm" onClick={() => onEnd(shift)}>
                      End Shift
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
