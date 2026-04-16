import type { ReactNode } from 'react';
import { BellDot, Clock3, ListTodo, Shirt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WORKER_COPY, getWorkerStationLabel } from '@/utils/worker';
import type { WorkerStation } from '@/types/worker-order';

type WorkerDashboardHeaderProps = {
  station?: WorkerStation | string | null;
  queueCount: number;
  notificationCount: number;
  isShiftActive: boolean;
};

type WorkerSummaryCardProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
};

function WorkerSummaryCard({
  title,
  icon,
  children,
}: WorkerSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function WorkerDashboardHeader({
  station,
  queueCount,
  notificationCount,
  isShiftActive,
}: WorkerDashboardHeaderProps) {
  const stationLabel =
    getWorkerStationLabel(station) ?? station ?? WORKER_COPY.unavailable;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
          {stationLabel}
        </Badge>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {WORKER_COPY.dashboardTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            {WORKER_COPY.dashboardDescription}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <WorkerSummaryCard
          title={WORKER_COPY.stationQueueTitle}
          icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
        >
          <div>
            <p className="text-3xl font-semibold">{queueCount}</p>
            <p className="text-xs text-muted-foreground">
              {WORKER_COPY.stationQueueDescription}
            </p>
          </div>
        </WorkerSummaryCard>

        <WorkerSummaryCard
          title={WORKER_COPY.queueUpdatesTitle}
          icon={<BellDot className="h-4 w-4 text-muted-foreground" />}
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-semibold">{notificationCount}</p>
              <Badge variant={notificationCount > 0 ? 'default' : 'secondary'}>
                {WORKER_COPY.queueUpdatesBadge}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {WORKER_COPY.queueUpdatesDescription}
            </p>
          </div>
        </WorkerSummaryCard>

        <WorkerSummaryCard
          title={WORKER_COPY.currentShiftTitle}
          icon={<Clock3 className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shirt className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">{stationLabel}</p>
            </div>
            <Badge variant={isShiftActive ? 'default' : 'secondary'}>
              {isShiftActive
                ? WORKER_COPY.currentShiftActive
                : WORKER_COPY.currentShiftInactive}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {WORKER_COPY.currentShiftDescription}
            </p>
          </div>
        </WorkerSummaryCard>
      </div>
    </section>
  );
}
