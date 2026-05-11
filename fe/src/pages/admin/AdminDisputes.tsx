import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';
import type { Dispute } from '@/types/admin';

const mockDisputes: Dispute[] = [
  {
    id: 'D-001',
    orderId: 'order-1',
    orderCode: 'DH-2024-001',
    buyerEmail: 'buyer@shopeeclone.com',
    sellerEmail: 'seller@shopeeclone.com',
    adminId: null,
    reason: 'Sản phẩm nhận được không đúng mô tả, màu sắc khác hoàn toàn so với ảnh trên web.',
    status: 'pending',
    createdAt: '2026-05-10T08:30:00Z',
    updatedAt: '2026-05-10T08:30:00Z',
  },
  {
    id: 'D-002',
    orderId: 'order-2',
    orderCode: 'DH-2024-002',
    buyerEmail: 'john@example.com',
    sellerEmail: 'seller@shopeeclone.com',
    adminId: 'admin-1',
    reason: 'Sản phẩm bị hỏng khi vận chuyển, vỡ một góc.',
    status: 'investigating',
    createdAt: '2026-05-09T14:20:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'D-003',
    orderId: 'order-3',
    orderCode: 'DH-2024-003',
    buyerEmail: 'alice@example.com',
    sellerEmail: 'shop2@shopeeclone.com',
    adminId: 'admin-1',
    reason: 'Giao hàng trễ hơn 7 ngày so với cam kết.',
    status: 'resolved',
    createdAt: '2026-05-08T09:00:00Z',
    updatedAt: '2026-05-09T16:30:00Z',
  },
];

const statusConfig: Record<string, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700', icon: Clock },
  investigating: { label: 'Đang điều tra', cls: 'bg-blue-100 text-blue-700', icon: Eye },
  resolved: { label: 'Đã giải quyết', cls: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'Đã từ chối', cls: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

export function AdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [filter, setFilter] = useState<string>('all');
  const { success: notifySuccess } = useNotifications();

  const handleResolve = (id: string) => {
    setDisputes(disputes.map((d) => (d.id === id ? { ...d, status: 'resolved' as const, updatedAt: new Date().toISOString() } : d)));
    notifySuccess('Đã giải quyết khiếu nại');
  };

  const handleReject = (id: string) => {
    setDisputes(disputes.map((d) => (d.id === id ? { ...d, status: 'rejected' as const, updatedAt: new Date().toISOString() } : d)));
    notifySuccess('Đã từ chối khiếu nại');
  };

  const handleInvestigate = (id: string) => {
    setDisputes(disputes.map((d) => (d.id === id ? { ...d, status: 'investigating' as const, updatedAt: new Date().toISOString() } : d)));
    notifySuccess('Đang tiến hành điều tra');
  };

  const filtered = filter === 'all' ? disputes : disputes.filter((d) => d.status === filter);
  const pendingCount = disputes.filter((d) => d.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Xử lý khiếu nại</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {disputes.length} khiếu nại · {pendingCount} chờ xử lý
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'investigating', 'resolved', 'rejected'].map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tất cả' : statusConfig[f]?.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((dispute) => {
          const config = statusConfig[dispute.status];
          const StatusIcon = config.icon;

          return (
            <Card key={dispute.id} className={dispute.status === 'pending' ? 'border-orange-200' : ''}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{dispute.id}</span>
                      <Badge className={config.cls}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">Đơn: {dispute.orderCode}</span>
                  </div>

                  {/* Reason */}
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{dispute.reason}</p>

                  {/* Parties */}
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>Người mua: <span className="font-medium text-foreground">{dispute.buyerEmail}</span></span>
                    <span>Người bán: <span className="font-medium text-foreground">{dispute.sellerEmail}</span></span>
                  </div>

                  {/* Actions */}
                  {(dispute.status === 'pending' || dispute.status === 'investigating') && (
                    <div className="flex gap-2 pt-1">
                      {dispute.status === 'pending' && (
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleInvestigate(dispute.id)}>
                          <Eye className="h-3.5 w-3.5" />
                          Điều tra
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="gap-1.5 bg-green-600 hover:bg-green-700"
                        onClick={() => handleResolve(dispute.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Giải quyết
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(dispute.id)}
                      >
                        Từ chối
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
