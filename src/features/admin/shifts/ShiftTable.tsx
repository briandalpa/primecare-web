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
      <div className="space-y-3 p-4 md:hidden">
        {shifts.length === 0 ? (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No shifts found.
          </div>
        ) : (
          shifts.map((shift) => (
            <div key={shift.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{shift.workerName ?? '-'}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatWorkerType(shift.workerType)}
                  </p>
                </div>

                <Badge variant={shift.isActive ? 'default' : 'secondary'}>
                  {shift.isActive ? 'Active' : 'Ended'}
                </Badge>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Outlet
                  </p>
                  <p className="mt-1">{shift.outletName}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Started
                  </p>
                  <p className="mt-1">{dateFormatter.format(new Date(shift.startedAt))}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Ended
                  </p>
                  <p className="mt-1">
                    {shift.endedAt ? dateFormatter.format(new Date(shift.endedAt)) : '-'}
                  </p>
                </div>
              </div>

              {canManage && shift.isActive ? (
                <Button variant="destructive" className="mt-4 w-full" onClick={() => onEnd(shift)}>
                  End Shift
                </Button>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block">
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
    </div>
  );
}
