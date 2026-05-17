import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { formatPrice, formatDate } from '@/utils/formatters';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { CheckCircle2, Truck, Package, Loader2 } from 'lucide-react';
import type { Order } from '@/types/order';

export function SellerOrders() {
  const queryClient = useQueryClient();
  const { success: notifySuccess } = useNotifications();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['seller-orders'],
    queryFn: apiService.getSellerOrders,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiService.updateSellerOrderStatus(id, status),
    onSuccess: (_d, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      notifySuccess(`Đã cập nhật trạng thái → ${ORDER_STATUS[status as keyof typeof ORDER_STATUS]}`);
    },
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  if (isLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} đơn hàng · {pendingCount} chờ xử lý</p>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey = order.status as keyof typeof ORDER_STATUS;
            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-sm">{order.code}</span>
                        <Badge className={ORDER_STATUS_COLOR[order.status] || ''}>{ORDER_STATUS[statusKey] || order.status}</Badge>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 mt-2">
                          <img src={item.product?.thumbnail} alt={item.product?.name || ''} className="w-10 h-10 rounded object-cover border shrink-0" loading="lazy" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate">{item.product?.name}</p>
                            <p className="text-xs text-muted-foreground">x{item.quantity} · {formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>{formatDate(order.createdAt)}</span>
                        <span>Địa chỉ: {order.shippingAddress}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                      {order.status === 'pending' && (
                        <Button size="sm" className="gap-1.5" onClick={() => updateMut.mutate({ id: order.id, status: 'processing' })} disabled={updateMut.isPending}>
                          <CheckCircle2 className="h-3.5 w-3.5" />Xác nhận
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button size="sm" className="gap-1.5" onClick={() => updateMut.mutate({ id: order.id, status: 'shipped' })} disabled={updateMut.isPending}>
                          <Truck className="h-3.5 w-3.5" />Giao hàng
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
