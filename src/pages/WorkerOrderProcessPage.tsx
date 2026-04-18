import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkerOrderProcessFormCard } from '@/features/worker/WorkerOrderProcessFormCard';
import { WorkerOrderProcessSkeleton } from '@/features/worker/WorkerOrderProcessSkeleton';
import { WorkerOrderProcessSummaryCard } from '@/features/worker/WorkerOrderProcessSummaryCard';
import { WorkerOrderReferenceCard } from '@/features/worker/WorkerOrderReferenceCard';
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
} from '@/utils/worker';

export default function WorkerOrderProcessPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderDetail = useWorkerOrderDetail(id);
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
  const mismatchByIndex = detail.referenceItems.map((item, index) => {
    const quantity = watchedItems?.[index]?.quantity ?? '';
    const hasValue = quantity !== '';
    const numericQuantity = Number(quantity);
    const isMismatch = hasValue && Number.isFinite(numericQuantity) && numericQuantity !== item.quantity;

    return isMismatch;
  });
  const hasMismatch = mismatchByIndex.some(Boolean);

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
      <WorkerOrderProcessFormCard
        errors={errors}
        hasMismatch={hasMismatch}
        isSubmitting={processOrder.isPending}
        items={detail.referenceItems}
        mismatchByIndex={mismatchByIndex}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
      />
    </div>
  );
}
