export type BypassStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ActionType = 'APPROVE' | 'REJECT';

export interface BypassRequest {
  id: string;
  orderId: string;
  station: string;
  workerName: string;
  problemDescription: string | null;
  mismatchItems: {
    laundryItemId: string;
    itemName: string;
    expectedQuantity: number;
    submittedQuantity: number;
  }[];
  status: BypassStatus;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string | null;
}
