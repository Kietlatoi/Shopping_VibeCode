export interface Dispute {
  id: string;
  orderId: string;
  orderCode: string;
  buyerEmail: string;
  sellerEmail: string;
  adminId: string | null;
  reason: string;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  userId: string;
  userEmail: string;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingApprovals: number;
  pendingDisputes: number;
}

export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
}
