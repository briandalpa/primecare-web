import { format } from 'date-fns';

export const DRIVER_COPY = {
  dashboardTitle: 'Driver Dashboard',
  historyTitle: 'Driver History',
  dashboardDescription:
    'View available pickup and delivery requests for your outlet. Accept one at a time.',
  activeTaskTitle: 'Active Task',
  activeTaskPickupLabel: 'Pickup Request',
  activeTaskDeliveryLabel: 'Delivery Request',
  activeTaskCompleteButton: 'Mark Complete',
  activeTaskCompleting: 'Completing...',
  activeTaskCompleteSuccess: 'Task completed successfully.',
  activeTaskCompleteError: 'Failed to complete task. Please try again.',
  pickupTabLabel: 'Pickup',
  deliveryTabLabel: 'Delivery',
  pickupEmptyState: 'No available pickup requests for your outlet.',
  deliveryEmptyState: 'No available delivery requests for your outlet.',
  pickupLoadError: 'Pickup requests could not be loaded. Please refresh.',
  deliveryLoadError: 'Delivery requests could not be loaded. Please refresh.',
  acceptButton: 'Accept',
  accepting: 'Accepting...',
  acceptSuccess: 'Request accepted. Complete it before accepting another.',
  acceptConflictError: 'You already have an active task. Complete it first.',
  acceptError: 'Failed to accept request. Please try again.',
  refreshButton: 'Refresh',
  customerLabel: 'Customer',
  addressLabel: 'Address',
  scheduledAtLabel: 'Scheduled at',
  orderIdLabel: 'Order ID',
  historyDescription:
    'Review your completed pickups and deliveries. Filter by date.',
  historyPickupTab: 'Pickup History',
  historyDeliveryTab: 'Delivery History',
  historyPickupEmpty:
    'No completed pickup history matches the current filters.',
  historyDeliveryEmpty:
    'No completed delivery history matches the current filters.',
  historyPickupError: 'Pickup history could not be loaded. Please retry.',
  historyDeliveryError: 'Delivery history could not be loaded. Please retry.',
  historyCompletedAtLabel: 'Completed at',
  historyDeliveredAtLabel: 'Delivered at',
  fromDateLabel: 'From',
  toDateLabel: 'To',
  resetFilters: 'Reset',
  paginationPagePrefix: 'Page',
  paginationOf: 'of',
  paginationTotalSuffix: 'total',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  driverRoleLabel: 'Driver',
  forbiddenTitle: 'Access denied',
  unavailable: 'Unavailable',
} as const;

export const DRIVER_DOCUMENT_TITLE = {
  dashboard: 'PrimeCare | Driver Dashboard',
  history: 'PrimeCare | Driver History',
} as const;

export const DRIVER_ROUTE = {
  base: '/driver',
  dashboard: '/driver/dashboard',
  active: '/driver/active',
  history: '/driver/history',
  profile: '/driver/profile',
  forbidden: '/forbidden',
  home: '/',
} as const;

export const DRIVER_TASK_STORAGE_KEY = 'driver_active_task';

export const DRIVER_HISTORY_DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  fromDate: '',
  toDate: '',
};

export function formatDriverDateTime(date: string) {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}
