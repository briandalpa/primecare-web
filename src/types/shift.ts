export type Shift = {
  id: string;
  staffId: string;
  workerType: string | null;
  workerName: string | null;
  outletId: string;
  outletName: string;
  startedAt: string;
  endedAt: string | null;
  isActive: boolean;
};

export type ShiftListParams = {
  page?: number;
  limit?: number;
  staffId?: string;
  outletId?: string;
  isActive?: boolean;
};

export type ShiftListResponse = {
  status: string;
  message: string;
  data: Shift[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateShiftValues = {
  staffId: string;
  startedAt: string;
};
