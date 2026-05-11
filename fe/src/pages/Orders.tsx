import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';
import { type Order } from '@/types/order';
import { formatPrice, formatDate } from '@/utils/formatters';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from '@/constants';
import { ErrorState } from '@/components/common/ErrorState';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package } from 'lucide-react';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await apiService.getOrders();
      setOrders(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Đơn mua của tôi</h1>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row justify-between items-center">
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-6 bg-muted rounded w-1/6" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <div className="h-10 bg-muted rounded w-24" />
                <div className="h-10 bg-muted rounded w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Đơn mua của tôi</h1>
        <ErrorState
          title="Không thể tải đơn hàng"
          message="Đã xảy ra lỗi khi tải danh sách đơn hàng."
          onRetry={fetchOrders}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <h1 className="text-3xl font-bold mb-6">Đơn mua của tôi</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</p>
          <p className="text-muted-foreground mb-6">Hãy khám phá và mua sắm sản phẩm yêu thích.</p>
          <Link to="/products">
            <Button size="lg" className="rounded-full px-8">Bắt đầu mua sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusKey = order.status as keyof typeof ORDER_STATUS;

            return (
              <Card key={order.id}>
                <CardHeader className="flex flex-row justify-between items-center bg-muted/50 py-3 px-6 border-b">
                  <div className="font-semibold">
                    Mã đơn: <span className="text-primary">{order.code}</span>
                  </div>
                  <Badge className={ORDER_STATUS_COLOR[order.status] || ''}>
                    {ORDER_STATUS[statusKey] || order.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center gap-4 p-4">
                        <img
                          src={item.product?.thumbnail}
                          alt={item.product?.name || 'Sản phẩm'}
                          className="w-20 h-20 object-cover rounded-md border"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold line-clamp-1">{item.product?.name || 'Sản phẩm'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Phân loại: {item.variant ? Object.values(item.variant.attributes).join(', ') : '—'}
                          </p>
                          <p className="text-sm text-muted-foreground">x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-end bg-muted/50 py-4 px-6 border-t gap-4">
                  <div className="text-sm text-muted-foreground w-full text-left">
                    Ngày đặt: {formatDate(order.createdAt)}
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full justify-end">
                    <div className="text-lg">
                      Tổng tiền: <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline">Xem chi tiết</Button>
                      </Link>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Link to={`/orders/${order.id}/tracking`}>
                          <Button>Theo dõi đơn hàng</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
