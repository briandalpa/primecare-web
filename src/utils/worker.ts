import { format } from 'date-fns';
import type {
  WorkerOrderListParams,
  WorkerNotificationEvent,
  WorkerOrderStatus,
  WorkerStation,
} from '@/types/worker-order';

export const WORKER_COPY = {
  dashboardTitle: 'Worker Dashboard',
  historyTitle: 'Worker History',
  dashboardDescription:
    'Review your station queue, monitor queue updates, and move to the next order without leaving the dashboard.',
  historyDescription:
    'Review completed station work, filter by date and station, and open item summaries for completed orders.',
  historyAllStations: 'All stations',
  historyCompletedAtLabel: 'Completed at',
  historyEmpty: 'No completed worker history matches the current filters.',
  historyLoadError:
    'Worker history could not be loaded. Please retry after the backend service is available.',
  historyOpenDetail: 'View details',
  historyDetailTitle: 'Completed Order Detail',
  historyDetailDescription:
    'Review the completed station details and item summary for this order.',
  processOrderTitle: 'Process Order',
  processOrderDescription:
    'Review the previous station quantities, re-enter the current station quantities, and submit the result.',
  processOrderReferenceTitle: 'Reference Items',
  processOrderReferenceDescription:
    'These quantities come from the previous completed station and are used as your comparison source.',
  processOrderFormTitle: 'Re-enter Quantities',
  processOrderFormDescription:
    'Enter the quantity you count for each laundry item before submitting this station result.',
  processOrderOrderIdLabel: 'Order ID',
  processOrderStationLabel: 'Station',
  processOrderPreviousStationLabel: 'Previous station',
  processOrderPaymentStatusLabel: 'Payment',
  processOrderItemLabel: 'Laundry item',
  processOrderReferenceQuantity: 'Reference qty',
  processOrderInputQuantity: 'Your qty',
  processOrderMismatchTitle: 'Quantity mismatch detected',
  processOrderMismatchDescription:
    'One or more item counts do not match the previous station reference. Review the highlighted rows before continuing.',
  processOrderMismatchInline: 'This quantity does not match the reference item count.',
  processOrderBypassRequest: 'Request Bypass',
  processOrderBypassDialogTitle: 'Request Bypass Approval',
  processOrderBypassDialogDescription:
    'Send the mismatch summary to the outlet admin for review before this order can continue.',
  processOrderBypassSummaryTitle: 'Mismatch Summary',
  processOrderBypassNotesLabel: 'Worker notes',
  processOrderBypassNotesPlaceholder:
    'Explain why the quantity does not match the previous station count.',
  processOrderBypassConfirm: 'Send bypass request',
  processOrderBypassSubmitting: 'Sending request...',
  processOrderBypassCancel: 'Cancel',
  processOrderBypassSuccess:
    'Bypass request submitted. Awaiting admin approval.',
  processOrderBypassFailure: 'Failed to submit bypass request.',
  processOrderBypassPendingTitle: 'Bypass request pending',
  processOrderBypassPendingDescription:
    'This order is waiting for outlet admin review. The process form will stay locked until the bypass request is resolved.',
  processOrderBypassRejected:
    'Bypass request was rejected. You can update the quantities and submit again.',
  processOrderBypassApproved:
    'Bypass request was approved. The order has moved to the next step.',
  processOrderSubmit: 'Submit station result',
  processOrderSubmitting: 'Submitting...',
  processOrderLoadError:
    'Worker order detail could not be loaded. Please retry after the backend service is available.',
  processOrderNotFound: 'Worker order detail is not available for this station.',
  processOrderSuccess: 'Worker order processed successfully',
  processOrderFailure: 'Failed to process worker order',
  processOrderBack: 'Back to dashboard',
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
  history: 'PrimeCare | Worker History',
  process: 'PrimeCare | Process Worker Order',
} as const;

export const WORKER_ROUTE = {
  base: '/worker',
  dashboard: '/worker/dashboard',
  history: '/worker/history',
  orderProcess: '/worker/orders/:id/process',
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

export const WORKER_HISTORY_DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  station: 'ALL' as const,
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

export function getWorkerOrderProcessRoute(orderId: string) {
  return `/worker/orders/${orderId}/process`;
}

export function formatWorkerDateTime(date: string) {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

export function isWorkerStation(value?: string): value is WorkerStation {
  return value === 'WASHING' || value === 'IRONING' || value === 'PACKING';
}
