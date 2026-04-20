export type Outlet = {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  maxServiceRadiusKm: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OutletListParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'city' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

export type OutletListResponse = {
  status: string;
  message: string;
  data: Outlet[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type OutletDetailResponse = {
  status: string;
  message: string;
  data: Outlet;
};

export type OutletFormValues = {
  name: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  maxServiceRadiusKm: number;
};
