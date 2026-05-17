import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PackageCheck, Users, AlertTriangle, ScrollText, ShoppingBag, ArrowUpRight, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DashboardStats, AuditLog } from '@/types/admin';

const actionColor: Record<string, string> = {
  APPROVE_PRODUCT: 'bg-green-100 text-green-700',
  BAN_USER: 'bg-red-100 text-red-700',
  RESOLVE_DISPUTE: 'bg-blue-100 text-blue-700',
  REJECT_PRODUCT: 'bg-red-100 text-red-700',
  UPDATE_USER_STATUS: 'bg-orange-100 text-orange-700',
};

function formatLogTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  return `${Math.floor(diffHour / 24)} ngày trước`;
}

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: apiService.getAdminDashboardStats,
  });

  const { data: recentLogs = [] } = useQuery<AuditLog[]>({
    queryKey: ['admin-audit-logs'],
    queryFn: apiService.getAuditLogs,
  });

  const statCards = [
    { label: 'Chờ duyệt SP', value: stats?.pendingApprovals ?? '-', icon: PackageCheck, color: 'text-orange-600 bg-orange-100', to: '/admin/products' },
    { label: 'Người dùng', value: stats?.totalUsers ?? '-', icon: Users, color: 'text-blue-600 bg-blue-100', to: '/admin/users' },
    { label: 'Khiếu nại mới', value: stats?.pendingDisputes ?? '-', icon: AlertTriangle, color: 'text-red-600 bg-red-100', to: '/admin/disputes' },
    { label: 'Tổng đơn hàng', value: stats?.totalOrders ?? '-', icon: ShoppingBag, color: 'text-green-600 bg-green-100', to: '/admin' },
  ];

  if (statsLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Tổng quan hệ thống</p>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          Hệ thống hoạt động bình thường
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><ScrollText className="h-5 w-5 text-primary" />Hoạt động gần đây</CardTitle>
          <Link to="/admin/audit-logs"><Button variant="ghost" size="sm" className="text-xs">Xem tất cả</Button></Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <Badge className={`shrink-0 ${actionColor[log.action] || 'bg-gray-100 text-gray-700'}`}>{log.action}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{JSON.stringify(log.metadata)}</p>
                <p className="text-xs text-muted-foreground">{log.userEmail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatLogTime(log.createdAt)}</span>
            </div>
          ))}
          {recentLogs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có hoạt động</p>}
        </CardContent>
      </Card>
    </div>
  );
}
