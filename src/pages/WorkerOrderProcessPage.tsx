import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useWorkerOrderDetail } from '@/hooks/useWorkerOrderDetail';
import { useProcessWorkerOrder } from '@/hooks/useProcessWorkerOrder';
import {
  workerProcessOrderSchema,
  type WorkerProcessOrderFormValues,
} from '@/features/worker/workerProcessOrderSchema';
import {
  WORKER_COPY,
  WORKER_DOCUMENT_TITLE,
  WORKER_ROUTE,
  formatWorkerDateTime,
  getWorkerStatusLabel,
} from '@/utils/worker';

function WorkerOrderProcessSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export default function WorkerOrderProcessPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderDetail = useWorkerOrderDetail(id);
  const processOrder = useProcessWorkerOrder();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkerProcessOrderFormValues>({
    resolver: zodResolver(workerProcessOrderSchema),
    defaultValues: { items: [] },
  });

  useEffect(() => {
    document.title = WORKER_DOCUMENT_TITLE.process;
  }, []);

  useEffect(() => {
    if (!orderDetail.data?.data) return;

    const detail = orderDetail.data.data;
    const existingItems = new Map(
      detail.stationItems.map((item) => [item.laundryItemId, String(item.quantity)]),
    );

    reset({
      items: detail.referenceItems.map((item) => ({
        laundryItemId: item.laundryItemId,
        quantity: existingItems.get(item.laundryItemId) ?? '',
      })),
    });
  }, [orderDetail.data, reset]);

  const onSubmit = (values: WorkerProcessOrderFormValues) => {
    processOrder.mutate(
      {
        id,
        payload: {
          items: values.items.map((item) => ({
            laundryItemId: item.laundryItemId,
            quantity: Number(item.quantity),
          })),
        },
      },
      {
        onSuccess: () => {
          toast.success(WORKER_COPY.processOrderSuccess);
          navigate(WORKER_ROUTE.dashboard);
        },
        onError: () => {
          toast.error(WORKER_COPY.processOrderFailure);
        },
      },
    );
  };

  if (orderDetail.isLoading) return <WorkerOrderProcessSkeleton />;

  if (orderDetail.isError || !orderDetail.data?.data) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-sm text-destructive">
            {WORKER_COPY.processOrderLoadError}
          </p>
          <Button asChild variant="outline">
            <Link to={WORKER_ROUTE.dashboard}>{WORKER_COPY.processOrderBack}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const detail = orderDetail.data.data;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to={WORKER_ROUTE.dashboard}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {WORKER_COPY.processOrderBack}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{WORKER_COPY.processOrderTitle}</CardTitle>
          <CardDescription>{WORKER_COPY.processOrderDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-4">
          <p>
            {WORKER_COPY.processOrderOrderIdLabel}: <span className="font-medium text-foreground">{detail.orderId}</span>
          </p>
          <p>
            {WORKER_COPY.processOrderStationLabel}: <span className="font-medium text-foreground">{detail.station}</span>
          </p>
          <p>
            {WORKER_COPY.processOrderPreviousStationLabel}: <span className="font-medium text-foreground">{detail.previousStation ?? WORKER_COPY.unavailable}</span>
          </p>
          <p>
            {WORKER_COPY.processOrderPaymentStatusLabel}: <span className="font-medium text-foreground">{detail.paymentStatus}</span>
          </p>
          <p>{WORKER_COPY.queueCustomer}: <span className="font-medium text-foreground">{detail.customerName ?? WORKER_COPY.unavailable}</span></p>
          <p>{WORKER_COPY.queueOutlet}: <span className="font-medium text-foreground">{detail.outletName ?? WORKER_COPY.unavailable}</span></p>
          <p>{WORKER_COPY.queueTotalItems}: <span className="font-medium text-foreground">{detail.totalItems}</span></p>
          <div className="flex items-center gap-2">
            <span>{WORKER_COPY.statusLabel}:</span>
            <Badge variant="secondary">{getWorkerStatusLabel(detail.stationStatus)}</Badge>
          </div>
          <p className="md:col-span-2 xl:col-span-4">
            Updated <span className="font-medium text-foreground">{formatWorkerDateTime(detail.updatedAt)}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{WORKER_COPY.processOrderReferenceTitle}</CardTitle>
          <CardDescription>
            {WORKER_COPY.processOrderReferenceDescription}
          </CardDescription>
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
              {detail.referenceItems.map((item) => (
                <TableRow key={item.laundryItemId}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{WORKER_COPY.processOrderFormTitle}</CardTitle>
          <CardDescription>{WORKER_COPY.processOrderFormDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  {detail.referenceItems.map((item, index) => (
                    <TableRow key={item.laundryItemId}>
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
                          <FieldError errors={[errors.items?.[index]?.quantity]} />
                        </Field>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </FieldGroup>

            <Button type="submit" disabled={processOrder.isPending}>
              {processOrder.isPending
                ? WORKER_COPY.processOrderSubmitting
                : WORKER_COPY.processOrderSubmit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
