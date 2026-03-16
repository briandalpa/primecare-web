export type DashboardOrder = {
  id: string;
  customerName: string;
  status: string;
  outletName: string;
  createdAt: string;
};

export type DashboardStats = {
  totalOrders: number;
  activeOutlets: number;
  registeredUsers: number;
  revenueMtd: number;
  recentOrders: DashboardOrder[];
};
