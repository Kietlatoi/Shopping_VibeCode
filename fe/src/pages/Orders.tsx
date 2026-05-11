import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';
import { type Order } from '@/mockdata/orders';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await apiService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Chờ xử lý</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/20 text-blue-700">Đang xử lý</Badge>;
      case 'shipped':
        return <Badge className="bg-yellow-500/20 text-yellow-700">Đang giao</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500/20 text-green-700">Đã giao</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Đơn mua của tôi</h1>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row justify-between items-center">
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded w-1/6"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <div className="h-10 bg-muted rounded w-24"></div>
                 <div className="h-10 bg-muted rounded w-32"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Đơn mua của tôi</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link to="/products">
            <Button>Bắt đầu mua sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-center bg-muted/50 py-3 px-6 border-b">
                <div className="font-semibold">Mã đơn: <span className="text-primary">{order.code}</span></div>
                {getStatusBadge(order.status)}
              </CardHeader>
              <CardContent className="p-0">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4 p-4">
                      <img src={item.product.thumbnail} alt={item.product.name} className="w-20 h-20 object-cover rounded-md border" />
                      <div className="flex-1">
                        <h4 className="font-semibold line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Phân loại: {Object.values(item.variant.attributes).join(', ')}
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
                 <div className='text-sm text-muted-foreground w-full text-left'>
                    Ngày đặt: {formatDate(order.createdAt)}
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full justify-end">
                    <div className="text-lg">Tổng tiền: <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span></div>
                    <div className="flex gap-2">
                        <Button variant="outline">Xem chi tiết</Button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                             <Button>Theo dõi đơn hàng</Button>
                        )}
                    </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
