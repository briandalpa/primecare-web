import { useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { NavigateFunction } from 'react-router-dom';
import { useCreateWorkerBypassRequest } from '@/hooks/useCreateWorkerBypassRequest';
import { useLaundryItems } from '@/hooks/useLaundryItems';
import { useProcessWorkerOrder } from '@/hooks/useProcessWorkerOrder';
import { useWorkerOrderDetail } from '@/hooks/useWorkerOrderDetail';
import type { WorkerBypassRequestFormValues } from '@/features/worker/workerBypassRequestSchema';
import {
  workerProcessOrderSchema,
  type WorkerProcessOrderFormValues,
} from '@/features/worker/workerProcessOrderSchema';
import { WORKER_COPY, WORKER_ROUTE } from '@/utils/worker';

type UseWorkerOrderProcessViewModelProps = {
  id: string;
  navigate: NavigateFunction;
};

export function useWorkerOrderProcessViewModel({
  id,
  navigate,
}: UseWorkerOrderProcessViewModelProps) {
  const [bypassDialogOpen, setBypassDialogOpen] = useState(false);
  const bypassRequest = useCreateWorkerBypassRequest();
  const processOrder = useProcessWorkerOrder();
  const laundryItems = useLaundryItems();
  const orderDetail = useWorkerOrderDetail(id, {
    refetchInterval: (query) => (
      query.state.data?.data?.stationStatus === 'BYPASS_REQUESTED' ? 3000 : false
    ),
  });
  const previousStationStatusRef = useRef<string | null>(null);

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

  const normalizedReferenceItems = useMemo(() => {
    const detail = orderDetail.data?.data;
    const masterItems = laundryItems.data?.data ?? [];

    if (!detail) return [];

    const itemNameMap = new Map(masterItems.map((item) => [item.id, item.name]));

    return detail.referenceItems.map((item) => ({
      ...item,
      itemName: itemNameMap.get(item.laundryItemId) ?? item.itemName,
    }));
  }, [laundryItems.data, orderDetail.data]);

  const mismatchByIndex = normalizedReferenceItems.map((item, index) => {
    const quantity = watchedItems?.[index]?.quantity ?? '';
    const hasValue = quantity !== '';
    const numericQuantity = Number(quantity);

    return hasValue && Number.isFinite(numericQuantity) && numericQuantity !== item.quantity;
  });

  const hasMismatch = mismatchByIndex.some(Boolean);
  const mismatchItems = normalizedReferenceItems
    .map((item, index) => ({
      itemName: item.itemName,
      laundryItemId: item.laundryItemId,
      referenceQuantity: item.quantity,
      submittedQuantity: Number(watchedItems?.[index]?.quantity ?? 0),
      isMismatch: mismatchByIndex[index],
    }))
    .filter((item) => item.isMismatch);

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

  return {
    bypassDialogOpen,
    setBypassDialogOpen,
    bypassRequest,
    processOrder,
    orderDetail,
    register,
    handleSubmit,
    errors,
    hasMismatch,
    mismatchByIndex,
    mismatchItems,
    normalizedReferenceItems,
    onSubmit,
    submitBypassRequest,
  };
}
