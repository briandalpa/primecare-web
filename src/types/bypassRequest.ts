export type BypassStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ActionType = "APPROVE" | "REJECT";

export interface BypassRequest {
  id: string;
  problemDescription: string | null;
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
  };
}