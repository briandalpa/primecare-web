export type BypassStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface BypassRequest {
  id: string;
  problemDescription?: string;
  status: BypassStatus;
  createdAt: string;

  workerId: string;
  stationRecordId: string;

  worker?: {
    id: string;
    name: string;
  };

  stationRecord?: {
    id: string;
    station?: {
      id: string;
      name: string;
    };
    order?: {
      id: string;
    };
    previousQuantity?: number;
    submittedQuantity?: number;
  };
}