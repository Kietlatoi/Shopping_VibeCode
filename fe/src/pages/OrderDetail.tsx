import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '@/services/api';
import { type Order } from '@/types/order';
import { formatPrice, formatDate } from '@/utils/formatters';
import { ORDER_STATUS, ORDER_STATUS_COLOR, PAYMENT_METHOD } from '@/constants';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success: notifySuccess } = useNotifications();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      try {
        const data = await apiService.getOrderById(id);
        setOrder(data ?? null);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const copyOrderCode = () => {
    if (order?.code) {
      navigator.clipboard.writeText(order.code);
      notifySuccess('Đã sao chép mã đơn hàng');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="h-8 bg-muted rounded w-40 mb-6 animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-48 bg-muted rounded-xl animate-pulse" />
            <div className="h-64 bg-muted rounded-xl animate-pulse" />
          </div>
          <div className="h-72 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1">
        <ErrorState
          title="Không thể tải đơn hàng"
          message="Đã xảy ra lỗi khi tải thông tin đơn hàng."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 flex-1 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
        <p className="text-muted-foreground mb-8">Đơn hàng này không tồn tại hoặc bạn không có quyền xem.</p>
        <Link to="/orders">
          <Button>Quay lại đơn hàng</Button>
        </Link>
      </div>
    );
  }

  const statusKey = order.status as keyof typeof ORDER_STATUS;

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/orders')}>
        <ChevronLeft className="h-4 w-4" />
        Đơn hàng của tôi
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chi tiết đơn hàng</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span className="text-sm">Mã đơn: <span className="font-medium text-foreground">{order.code}</span></span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyOrderCode}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <Badge className={ORDER_STATUS_COLOR[order.status] || ''}>
          {ORDER_STATUS[statusKey] || order.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main — Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" />
                Sản phẩm ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {order.items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center gap-4 py-4">
                    <Link to={`/products/${item.product?.id}`}>
                      <img
                        src={item.product?.thumbnail}
                        alt={item.product?.name || 'Sản phẩm'}
                        className="w-20 h-20 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product?.id}`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product?.name || 'Sản phẩm không xác định'}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phân loại: {item.variant ? Object.values(item.variant.attributes).join(', ') : '—'}
                      </p>
                      <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  {index < order.items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order tracking quick link */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Theo dõi tiến trình đơn hàng</span>
                </div>
                <Link to={`/orders/${order.id}/tracking`}>
                  <Button size="sm" className="rounded-xl">Theo dõi</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar — Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Ngày đặt hàng</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Địa chỉ nhận hàng</p>
                  <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Thanh toán</p>
                  <p className="text-sm text-muted-foreground">
                    {PAYMENT_METHOD[order.paymentMethod as keyof typeof PAYMENT_METHOD] || order.paymentMethod}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-bold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
