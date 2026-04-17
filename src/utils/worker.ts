import { format } from 'date-fns';
import type {
  WorkerOrderListParams,
  WorkerNotificationEvent,
  WorkerOrderStatus,
  WorkerStation,
} from '@/types/worker-order';

export const WORKER_COPY = {
  dashboardTitle: 'Worker Dashboard',
  dashboardDescription:
    'Review your station queue, monitor queue updates, and move to the next order without leaving the dashboard.',
  stationQueueTitle: 'Station Queue',
  stationQueueDescription: 'Orders currently visible for your station.',
  queueUpdatesTitle: 'Queue Updates',
  queueUpdatesBadge: 'badge',
  queueUpdatesDescription:
    'Updates in real time when a new order arrives at your station.',
  currentShiftTitle: 'Current Shift',
  currentShiftActive: 'On Duty',
  currentShiftInactive: 'Unavailable',
  currentShiftDescription:
    'Using the current worker active flag until shift-specific backend data is exposed.',
  statusLabel: 'Status',
  statusPlaceholder: 'All statuses',
  dateLabel: 'Process date',
  resetFilters: 'Reset filters',
  queueLoadError:
    'Worker orders could not be loaded. Please retry after the backend service is available.',
  queueEmpty: 'No worker orders match the current filters.',
  queueTotalItems: 'Total items',
  queueStation: 'Station',
  queueCustomer: 'Customer',
  queueOutlet: 'Outlet',
  unavailable: 'Unavailable',
  forbiddenTitle: 'Access denied',
  forbiddenDescription:
    'This page is not available for your current role. Please go back to a page that matches your access level.',
  forbiddenAction: 'Return to home',
  workerRoleLabel: 'Worker',
  paginationPagePrefix: 'Page',
  paginationOf: 'of',
  paginationTotalOrdersSuffix: 'total orders',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
} as const;

export const WORKER_DOCUMENT_TITLE = {
  dashboard: 'PrimeCare | Worker Dashboard',
} as const;

export const WORKER_ROUTE = {
  base: '/worker',
  dashboard: '/worker/dashboard',
  forbidden: '/forbidden',
  home: '/',
} as const;

export const WORKER_NOTIFICATION_EVENT: WorkerNotificationEvent =
  'worker-order-arrived';

export const WORKER_DEFAULT_FILTERS: Required<WorkerOrderListParams> = {
  page: 1,
  limit: 10,
  status: 'ALL',
  date: '',
};

export const WORKER_STATION_LABEL: Record<WorkerStation, string> = {
  WASHING: 'Washing Station',
  IRONING: 'Ironing Station',
  PACKING: 'Packing Station',
};

export const WORKER_STATUS_LABEL: Record<WorkerOrderStatus, string> = {
  IN_PROGRESS: 'In Progress',
  BYPASS_REQUESTED: 'Bypass Requested',
  COMPLETED: 'Completed',
};

export const WORKER_STATUS_BADGE_VARIANT: Record<
  WorkerOrderStatus,
  'secondary' | 'destructive' | 'outline'
> = {
  IN_PROGRESS: 'secondary',
  BYPASS_REQUESTED: 'destructive',
  COMPLETED: 'outline',
};

export const WORKER_STATUS_FILTER_OPTIONS: Array<{
  value: WorkerOrderListParams['status'];
  label: string;
}> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'IN_PROGRESS', label: WORKER_STATUS_LABEL.IN_PROGRESS },
  { value: 'BYPASS_REQUESTED', label: WORKER_STATUS_LABEL.BYPASS_REQUESTED },
  { value: 'COMPLETED', label: WORKER_STATUS_LABEL.COMPLETED },
];

export function getWorkerStationLabel(station?: string | null) {
  if (station === 'WASHING' || station === 'IRONING' || station === 'PACKING') {
    return WORKER_STATION_LABEL[station];
  }

  return undefined;
}

export function getWorkerStatusLabel(status: WorkerOrderStatus) {
  return WORKER_STATUS_LABEL[status];
}

export function formatWorkerDateTime(date: string) {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

export function isWorkerStation(value?: string): value is WorkerStation {
  return value === 'WASHING' || value === 'IRONING' || value === 'PACKING';
}
