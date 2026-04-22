import { ComplaintStatus } from '@/types/enums';

export const COMPLAINT_STATUS_LABEL: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: 'Open',
  [ComplaintStatus.IN_REVIEW]: 'In Review',
  [ComplaintStatus.RESOLVED]: 'Resolved',
};

export const COMPLAINT_STATUS_COLOR: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: 'border-yellow-400 text-yellow-700 bg-yellow-50',
  [ComplaintStatus.IN_REVIEW]: 'border-blue-400 text-blue-700 bg-blue-50',
  [ComplaintStatus.RESOLVED]: 'border-green-400 text-green-700 bg-green-50',
};

export const COMPLAINT_STATUS_SEQUENCE: ComplaintStatus[] = [
  ComplaintStatus.OPEN,
  ComplaintStatus.IN_REVIEW,
  ComplaintStatus.RESOLVED,
];
