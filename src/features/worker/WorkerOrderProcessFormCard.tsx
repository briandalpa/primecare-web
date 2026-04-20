import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WorkerOrderDetailItem } from '@/types/worker-order';
import type { WorkerProcessOrderFormValues } from '@/features/worker/workerProcessOrderSchema';
import { WORKER_COPY } from '@/utils/worker';

type WorkerOrderProcessFormCardProps = {
  errors: FieldErrors<WorkerProcessOrderFormValues>;
  hasMismatch: boolean;
  isAwaitingBypassApproval: boolean;
  isBypassSubmitting: boolean;
  isSubmitting: boolean;
  items: WorkerOrderDetailItem[];
  mismatchByIndex: boolean[];
  onRequestBypass: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<WorkerProcessOrderFormValues>;
};

export function WorkerOrderProcessFormCard({
  errors,
  hasMismatch,
  isAwaitingBypassApproval,
  isBypassSubmitting,
  isSubmitting,
  items,
  mismatchByIndex,
  onRequestBypass,
  onSubmit,
  register,
}: WorkerOrderProcessFormCardProps) {
  const isFormLocked = isSubmitting || hasMismatch || isAwaitingBypassApproval;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{WORKER_COPY.processOrderFormTitle}</CardTitle>
        <CardDescription>{WORKER_COPY.processOrderFormDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit}>
          {hasMismatch ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                {WORKER_COPY.processOrderMismatchTitle}
              </p>
              <p className="mt-1 text-sm text-destructive">
                {WORKER_COPY.processOrderMismatchDescription}
              </p>
            </div>
          ) : null}

          <FieldGroup>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{WORKER_COPY.processOrderItemLabel}</TableHead>
                  <TableHead>{WORKER_COPY.processOrderReferenceQuantity}</TableHead>
                  <TableHead>{WORKER_COPY.processOrderInputQuantity}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow
                    key={item.laundryItemId}
                    className={mismatchByIndex[index] ? 'bg-destructive/5' : undefined}
                  >
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="space-y-2">
                      <input
                        type="hidden"
                        {...register(`items.${index}.laundryItemId`)}
                        defaultValue={item.laundryItemId}
                      />
                      <Field data-invalid={!!errors.items?.[index]?.quantity}>
                        <FieldLabel className="sr-only" htmlFor={`items.${index}.quantity`}>
                          {item.itemName}
                        </FieldLabel>
                        <Input
                          id={`items.${index}.quantity`}
                          inputMode="numeric"
                          placeholder="0"
                          {...register(`items.${index}.quantity`)}
                        />
                        {mismatchByIndex[index] ? (
                          <p className="text-xs text-destructive">
                            {WORKER_COPY.processOrderMismatchInline}
                          </p>
                        ) : null}
                        <FieldError errors={[errors.items?.[index]?.quantity]} />
                      </Field>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </FieldGroup>

          <div className="flex flex-wrap gap-3">
            {hasMismatch ? (
              <Button
                type="button"
                variant="outline"
                onClick={onRequestBypass}
                disabled={isBypassSubmitting || isAwaitingBypassApproval}
              >
                {WORKER_COPY.processOrderBypassRequest}
              </Button>
            ) : null}
            <Button type="submit" disabled={isFormLocked}>
              {isSubmitting
                ? WORKER_COPY.processOrderSubmitting
                : WORKER_COPY.processOrderSubmit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
