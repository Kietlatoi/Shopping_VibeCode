import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, TrendingUp, Warehouse, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';
import type { SellerStats } from '@/types/admin';
import type { Order } from '@/types/order';

const statusMap: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700' },
  shipped: { label: 'Đang giao', cls: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Đã giao', cls: 'bg-green-100 text-green-700' },
  processing: { label: 'Đang xử lý', cls: 'bg-orange-100 text-orange-700' },
};

export function SellerDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<SellerStats>({
    queryKey: ['seller-stats'],
    queryFn: apiService.getSellerStats,
  });

  const { data: recentOrders = [] } = useQuery<Order[]>({
    queryKey: ['seller-orders'],
    queryFn: apiService.getSellerOrders,
  });

  const statCards = [
    { label: 'Tổng sản phẩm', value: stats?.totalProducts ?? '-', icon: Package, color: 'text-blue-600 bg-blue-100', to: '/seller/products' },
    { label: 'Đơn hàng', value: stats?.totalOrders ?? '-', icon: ClipboardList, color: 'text-green-600 bg-green-100', to: '/seller/orders' },
    { label: 'Doanh thu', value: stats ? formatPrice(stats.totalRevenue) : '-', icon: TrendingUp, color: 'text-purple-600 bg-purple-100', to: '/seller/revenue' },
    { label: 'Sắp hết hàng', value: stats?.lowStockItems ?? '-', icon: Warehouse, color: 'text-orange-600 bg-orange-100', to: '/seller/inventory' },
  ];

  if (statsLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Tổng quan kênh bán hàng của bạn</p>
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
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Đơn hàng gần đây</CardTitle>
            <Link to="/seller/orders"><Button variant="ghost" size="sm" className="text-xs">Xem tất cả</Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{order.code}</p>
                  <p className="text-xs text-muted-foreground truncate">{order.items[0]?.product?.name || 'Đơn hàng'}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusMap[order.status]?.cls || ''}`}>{statusMap[order.status]?.label || order.status}</span>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có đơn hàng</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><AlertCircle className="h-5 w-5 text-orange-500" />Cần chú ý</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50">
              <Warehouse className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{stats?.lowStockItems ?? 0} sản phẩm sắp hết hàng</p>
                <p className="text-xs text-muted-foreground mt-0.5">Kiểm tra kho hàng để cập nhật số lượng tồn kho</p>
                <Link to="/seller/inventory"><Button variant="link" size="sm" className="px-0 h-auto text-xs mt-1">Xem kho hàng →</Button></Link>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50">
              <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{stats?.pendingOrders ?? 0} đơn hàng chờ xử lý</p>
                <p className="text-xs text-muted-foreground mt-0.5">Xác nhận và đóng gói đơn hàng mới</p>
                <Link to="/seller/orders"><Button variant="link" size="sm" className="px-0 h-auto text-xs mt-1">Xem đơn hàng →</Button></Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
