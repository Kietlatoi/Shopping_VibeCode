import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, BarChart3 } from 'lucide-react';

const monthlyData = [
  { month: 'T1', revenue: 8500000 },
  { month: 'T2', revenue: 10200000 },
  { month: 'T3', revenue: 9800000 },
  { month: 'T4', revenue: 12500000 },
  { month: 'T5', revenue: 14200000 },
];

const topProducts = [
  { name: 'Tai nghe Bluetooth VibeBuds Pro', sold: 152, revenue: 135280000 },
  { name: 'Bàn phím cơ VibeKey K68', sold: 84, revenue: 105000000 },
  { name: 'Chuột không dây VibeMouse M1', sold: 210, revenue: 73500000 },
  { name: 'Đồng hồ VibeWatch Pro', sold: 68, revenue: 125800000 },
];

export function SellerRevenue() {
  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const currentMonth = monthlyData[monthlyData.length - 1].revenue;
  const prevMonth = monthlyData[monthlyData.length - 2].revenue;
  const growth = ((currentMonth - prevMonth) / prevMonth) * 100;
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thống kê doanh thu</h1>
        <p className="text-sm text-muted-foreground mt-1">Tổng quan hiệu quả kinh doanh</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              {growth > 0 ? (
                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +{growth.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                  <TrendingDown className="h-3.5 w-3.5" />
                  {growth.toFixed(1)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold mt-3">{formatPrice(currentMonth)}</p>
            <p className="text-sm text-muted-foreground">Doanh thu tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold mt-3">514</p>
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold mt-3">328</p>
            <p className="text-sm text-muted-foreground">Khách hàng</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart (CSS-based) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Doanh thu theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d) => {
                const heightPercent = (d.revenue / maxRevenue) * 100;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {formatPrice(d.revenue).replace('₫', '').trim()}
                    </span>
                    <div
                      className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs font-medium">{d.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">Tổng doanh thu 5 tháng</p>
              <p className="text-xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    index === 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : index === 1
                        ? 'bg-gray-100 text-gray-600'
                        : index === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sold} đã bán</p>
                </div>
                <span className="text-sm font-semibold text-primary shrink-0">{formatPrice(product.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
