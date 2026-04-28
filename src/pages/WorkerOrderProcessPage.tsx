import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkerBypassRequestDialog } from '@/features/worker/WorkerBypassRequestDialog';
import { WorkerOrderProcessFormCard } from '@/features/worker/WorkerOrderProcessFormCard';
import { WorkerOrderProcessSkeleton } from '@/features/worker/WorkerOrderProcessSkeleton';
import { WorkerOrderProcessSummaryCard } from '@/features/worker/WorkerOrderProcessSummaryCard';
import { WorkerOrderReferenceCard } from '@/features/worker/WorkerOrderReferenceCard';
import type { WorkerBypassRequestFormValues } from '@/features/worker/workerBypassRequestSchema';
import { useWorkerOrderProcessViewModel } from '@/features/worker/useWorkerOrderProcessViewModel';
import { WORKER_COPY, WORKER_DOCUMENT_TITLE, WORKER_ROUTE } from '@/utils/worker';

export default function WorkerOrderProcessPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
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
  } = useWorkerOrderProcessViewModel({ id, navigate });

  useEffect(() => {
    document.title = WORKER_DOCUMENT_TITLE.process;
  }, []);

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
  const isStationCompleted = detail.stationStatus === 'COMPLETED';

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to={WORKER_ROUTE.dashboard}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {WORKER_COPY.processOrderBack}
        </Link>
      </Button>

      <WorkerOrderProcessSummaryCard detail={detail} />
      <WorkerOrderReferenceCard items={normalizedReferenceItems} />
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
      {isStationCompleted ? (
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm font-medium text-foreground">
              {WORKER_COPY.processOrderCompletedTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {WORKER_COPY.processOrderCompletedDescription}
            </p>
          </CardContent>
        </Card>
      ) : (
        <WorkerOrderProcessFormCard
          errors={errors}
          hasMismatch={hasMismatch}
          isAwaitingBypassApproval={isAwaitingBypassApproval}
          isBypassSubmitting={bypassRequest.isPending}
          isSubmitting={processOrder.isPending}
          items={normalizedReferenceItems}
          mismatchByIndex={mismatchByIndex}
          onRequestBypass={() => setBypassDialogOpen(true)}
          onSubmit={handleSubmit(onSubmit)}
          register={register}
        />
      )}
      <WorkerBypassRequestDialog
        isSubmitting={bypassRequest.isPending}
        items={mismatchItems}
        open={bypassDialogOpen && !isAwaitingBypassApproval && !isStationCompleted}
        onOpenChange={setBypassDialogOpen}
        onSubmit={(values: WorkerBypassRequestFormValues) => submitBypassRequest(values)}
      />
    </div>
  );
}
