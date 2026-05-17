import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/utils/formatters';
import { TrendingUp, DollarSign, ShoppingBag, Users, BarChart3, Loader2 } from 'lucide-react';
import type { SellerStats } from '@/types/admin';
import type { Order } from '@/types/order';

export function SellerRevenue() {
  const { data: stats, isLoading: statsLoading } = useQuery<SellerStats>({
    queryKey: ['seller-stats'],
    queryFn: apiService.getSellerStats,
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['seller-orders'],
    queryFn: apiService.getSellerOrders,
  });

  // Group orders by month for chart
  const monthlyData = orders.reduce<Record<string, number>>((acc, order) => {
    const date = new Date(order.createdAt);
    const key = `T${date.getMonth() + 1}`;
    acc[key] = (acc[key] || 0) + order.totalAmount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);

  if (statsLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thống kê doanh thu</h1>
        <p className="text-sm text-muted-foreground mt-1">Tổng quan hiệu quả kinh doanh</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium"><TrendingUp className="h-3.5 w-3.5" /></div>
            </div>
            <p className="text-2xl font-bold mt-3">{formatPrice(stats?.totalRevenue ?? 0)}</p>
            <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><ShoppingBag className="h-5 w-5 text-blue-600" /></div>
            <p className="text-2xl font-bold mt-3">{stats?.totalOrders ?? 0}</p>
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Users className="h-5 w-5 text-purple-600" /></div>
            <p className="text-2xl font-bold mt-3">{stats?.totalProducts ?? 0}</p>
            <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Doanh thu theo tháng</CardTitle></CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <>
                <div className="flex items-end gap-3 h-48">
                  {chartData.map((d) => {
                    const heightPercent = (d.revenue / maxRevenue) * 100;
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] text-muted-foreground font-medium">{formatPrice(d.revenue).replace('₫', '').trim()}</span>
                        <div className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary" style={{ height: `${heightPercent}%` }} />
                        <span className="text-xs font-medium">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu doanh thu</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Đơn hàng gần đây</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {orders.slice(0, 5).map((order, index) => (
              <div key={order.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-600' : 'bg-muted text-muted-foreground'}`}>{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{order.code}</p>
                  <p className="text-xs text-muted-foreground">{order.items.length} sản phẩm</p>
                </div>
                <span className="text-sm font-semibold text-primary shrink-0">{formatPrice(order.totalAmount)}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có dữ liệu</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
