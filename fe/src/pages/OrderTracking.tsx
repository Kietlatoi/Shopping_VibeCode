import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useNotifications } from '@/hooks/useNotifications';
import { type Order } from '@/types/order';
import { formatDate } from '@/utils/formatters';
import { ORDER_STATUS } from '@/constants';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronLeft,
  Package,
  CheckCircle2,
  Truck,
  ClipboardCheck,
  CircleDot,
  Clock,
} from 'lucide-react';

interface TrackingStep {
  key: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  time: string | null;
  isActive: boolean;
  isCompleted: boolean;
}

const getTrackingSteps = (order: Order): TrackingStep[] => {
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(order.status);

  if (order.status === 'cancelled') {
    return [
      {
        key: 'pending',
        icon: <Clock className="h-5 w-5" />,
        label: 'Đã đặt hàng',
        description: 'Đơn hàng đã được tiếp nhận',
        time: order.createdAt,
        isActive: false,
        isCompleted: true,
      },
      {
        key: 'cancelled',
        icon: <CircleDot className="h-5 w-5" />,
        label: 'Đã hủy',
        description: 'Đơn hàng đã bị hủy',
        time: order.updatedAt,
        isActive: true,
        isCompleted: false,
      },
    ];
  }

  return [
    {
      key: 'pending',
      icon: <ClipboardCheck className="h-5 w-5" />,
      label: 'Đã đặt hàng',
      description: 'Đơn hàng đã được tiếp nhận và đang chờ xác nhận',
      time: order.createdAt,
      isActive: currentIndex === 0,
      isCompleted: currentIndex > 0,
    },
    {
      key: 'processing',
      icon: <Package className="h-5 w-5" />,
      label: 'Đang xử lý',
      description: 'Đơn hàng đang được đóng gói và chuẩn bị giao',
      time: currentIndex >= 1 ? order.updatedAt : null,
      isActive: currentIndex === 1,
      isCompleted: currentIndex > 1,
    },
    {
      key: 'shipped',
      icon: <Truck className="h-5 w-5" />,
      label: 'Đang giao hàng',
      description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      time: currentIndex >= 2 ? order.updatedAt : null,
      isActive: currentIndex === 2,
      isCompleted: currentIndex > 2,
    },
    {
      key: 'delivered',
      icon: <CheckCircle2 className="h-5 w-5" />,
      label: 'Đã giao thành công',
      description: 'Đơn hàng đã được giao đến bạn',
      time: currentIndex >= 3 ? order.updatedAt : null,
      isActive: currentIndex === 3,
      isCompleted: currentIndex >= 3,
    },
  ];
};

export function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success: notifySuccess, error: notifyError } = useNotifications();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const confirmMutation = useMutation({
    mutationFn: (orderId: string) => apiService.confirmDelivery(orderId),
    onSuccess: () => {
      notifySuccess('Đã xác nhận nhận hàng thành công!');
      // Refresh order data
      if (id) {
        apiService.getOrderById(id).then((data) => setOrder(data ?? null));
      }
    },
    onError: () => notifyError('Không thể xác nhận. Vui lòng thử lại.'),
  });

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
        <div className="h-8 bg-muted rounded w-40 mb-8 animate-pulse" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1">
        <ErrorState
          title="Không thể tải thông tin"
          message="Đã xảy ra lỗi khi tải trạng thái đơn hàng."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 flex-1 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
        <p className="text-muted-foreground mb-8">Đơn hàng này không tồn tại.</p>
        <Link to="/orders">
          <Button>Quay lại đơn hàng</Button>
        </Link>
      </div>
    );
  }

  const steps = getTrackingSteps(order);
  const statusKey = order.status as keyof typeof ORDER_STATUS;

  return (
    <div className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(`/orders/${order.id}`)}>
        <ChevronLeft className="h-4 w-4" />
        Chi tiết đơn hàng
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Theo dõi đơn hàng</h1>
        <p className="text-muted-foreground mt-1">
          Mã đơn: <span className="font-medium text-foreground">{order.code}</span>
          {' — '}
          <span className="font-medium">{ORDER_STATUS[statusKey] || order.status}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tiến trình giao hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;

              return (
                <div key={step.key} className="flex gap-4 pb-8 last:pb-0">
                  {/* Timeline line + icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        step.isCompleted
                          ? 'bg-green-100 text-green-600'
                          : step.isActive
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.icon}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          step.isCompleted ? 'bg-green-300' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-2 pt-1">
                    <h3
                      className={`font-semibold ${
                        step.isActive ? 'text-primary' : step.isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                    {step.time && (
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(step.time)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confirm delivery button for buyer */}
      {order.status === 'shipped' && (
        <div className="mt-6 p-4 rounded-xl border border-green-200 bg-green-50 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Bạn đã nhận được hàng?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Xác nhận để hoàn tất đơn hàng
            </p>
          </div>
          <Button
            className="gap-2 bg-green-600 hover:bg-green-700"
            onClick={() => confirmMutation.mutate(order.id)}
            disabled={confirmMutation.isPending}
          >
            <CheckCircle2 className="h-4 w-4" />
            {confirmMutation.isPending ? 'Đang xử lý...' : 'Đã nhận hàng'}
          </Button>
        </div>
      )}
    </div>
  );
}
