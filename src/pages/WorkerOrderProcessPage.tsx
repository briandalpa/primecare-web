import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkerBypassRequestDialog } from '@/features/worker/WorkerBypassRequestDialog';
import { WorkerOrderProcessFormCard } from '@/features/worker/WorkerOrderProcessFormCard';
import { WorkerOrderProcessSkeleton } from '@/features/worker/WorkerOrderProcessSkeleton';
import { WorkerOrderProcessSummaryCard } from '@/features/worker/WorkerOrderProcessSummaryCard';
import { WorkerOrderReferenceCard } from '@/features/worker/WorkerOrderReferenceCard';
import { useCreateWorkerBypassRequest } from '@/hooks/useCreateWorkerBypassRequest';
import { useWorkerOrderDetail } from '@/hooks/useWorkerOrderDetail';
import { useProcessWorkerOrder } from '@/hooks/useProcessWorkerOrder';
import {
  workerProcessOrderSchema,
  type WorkerProcessOrderFormValues,
} from '@/features/worker/workerProcessOrderSchema';
import type { WorkerBypassRequestFormValues } from '@/features/worker/workerBypassRequestSchema';
import {
  WORKER_COPY,
  WORKER_DOCUMENT_TITLE,
  WORKER_ROUTE,
} from '@/utils/worker';

export default function WorkerOrderProcessPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [bypassDialogOpen, setBypassDialogOpen] = useState(false);
  const navigate = useNavigate();
  const bypassRequest = useCreateWorkerBypassRequest();
  const orderDetail = useWorkerOrderDetail(id, {
    refetchInterval: (query) => (
      query.state.data?.data?.stationStatus === 'BYPASS_REQUESTED' ? 3000 : false
    ),
  });
  const processOrder = useProcessWorkerOrder();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkerProcessOrderFormValues>({
    resolver: zodResolver(workerProcessOrderSchema),
    defaultValues: { items: [] },
  });
  const previousStationStatusRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = WORKER_DOCUMENT_TITLE.process;
  }, []);

  const watchedItems = useWatch({ control, name: 'items' });

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

  useEffect(() => {
    const detail = orderDetail.data?.data;

    if (!detail) return;

    const previousStatus = previousStationStatusRef.current;
    const currentStatus = detail.stationStatus;

    if (previousStatus === 'BYPASS_REQUESTED' && currentStatus !== previousStatus) {
      if (currentStatus === 'IN_PROGRESS') {
        toast.success(WORKER_COPY.processOrderBypassRejected);
      }

      if (currentStatus === 'COMPLETED') {
        toast.success(WORKER_COPY.processOrderBypassApproved);
        navigate(WORKER_ROUTE.dashboard);
      }
    }

    previousStationStatusRef.current = currentStatus;
  }, [navigate, orderDetail.data]);

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
  const isAwaitingBypassApproval = detail.stationStatus === 'BYPASS_REQUESTED';
  const mismatchByIndex = detail.referenceItems.map((item, index) => {
    const quantity = watchedItems?.[index]?.quantity ?? '';
    const hasValue = quantity !== '';
    const numericQuantity = Number(quantity);
    return hasValue && Number.isFinite(numericQuantity) && numericQuantity !== item.quantity;
  });
  const hasMismatch = mismatchByIndex.some(Boolean);
  const mismatchItems = detail.referenceItems
    .map((item, index) => ({
      itemName: item.itemName,
      laundryItemId: item.laundryItemId,
      referenceQuantity: item.quantity,
      submittedQuantity: Number(watchedItems?.[index]?.quantity ?? 0),
      isMismatch: mismatchByIndex[index],
    }))
    .filter((item) => item.isMismatch);

  const submitBypassRequest = (values: WorkerBypassRequestFormValues) => {
    handleSubmit((formValues) => {
      bypassRequest.mutate(
        {
          id,
          payload: {
            items: formValues.items.map((item) => ({
              laundryItemId: item.laundryItemId,
              quantity: Number(item.quantity),
            })),
            notes: values.notes,
          },
        },
        {
          onSuccess: () => {
            setBypassDialogOpen(false);
            toast.success(WORKER_COPY.processOrderBypassSuccess);
          },
          onError: () => {
            toast.error(WORKER_COPY.processOrderBypassFailure);
          },
        },
      );
    })();
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to={WORKER_ROUTE.dashboard}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {WORKER_COPY.processOrderBack}
        </Link>
      </Button>

      <WorkerOrderProcessSummaryCard detail={detail} />
      <WorkerOrderReferenceCard items={detail.referenceItems} />
      {isAwaitingBypassApproval ? (
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm font-medium text-foreground">
              {WORKER_COPY.processOrderBypassPendingTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {WORKER_COPY.processOrderBypassPendingDescription}
            </p>
          </CardContent>
        </Card>
      ) : null}
      <WorkerOrderProcessFormCard
        errors={errors}
        hasMismatch={hasMismatch}
        isAwaitingBypassApproval={isAwaitingBypassApproval}
        isBypassSubmitting={bypassRequest.isPending}
        isSubmitting={processOrder.isPending}
        items={detail.referenceItems}
        mismatchByIndex={mismatchByIndex}
        onRequestBypass={() => setBypassDialogOpen(true)}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
      />
      <WorkerBypassRequestDialog
        isSubmitting={bypassRequest.isPending}
        items={mismatchItems}
        open={bypassDialogOpen && !isAwaitingBypassApproval}
        onOpenChange={setBypassDialogOpen}
        onSubmit={submitBypassRequest}
      />
    </div>
  );
}
