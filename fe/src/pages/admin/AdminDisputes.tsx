import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { AlertTriangle, CheckCircle2, Clock, Eye, Loader2 } from 'lucide-react';
import type { Dispute } from '@/types/admin';

const statusConfig: Record<string, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700', icon: Clock },
  investigating: { label: 'Đang điều tra', cls: 'bg-blue-100 text-blue-700', icon: Eye },
  resolved: { label: 'Đã giải quyết', cls: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'Đã từ chối', cls: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

export function AdminDisputes() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');
  const { success: notifySuccess } = useNotifications();

  const { data: disputes = [], isLoading } = useQuery<Dispute[]>({
    queryKey: ['admin-disputes'],
    queryFn: apiService.getDisputes,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiService.updateDisputeStatus(id, status),
    onSuccess: (_d, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      notifySuccess(`Đã cập nhật: ${statusConfig[status]?.label || status}`);
    },
  });

  const filtered = filter === 'all' ? disputes : disputes.filter((d) => d.status === filter);

  if (isLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Xử lý khiếu nại</h1>
        <p className="text-sm text-muted-foreground mt-1">{disputes.length} khiếu nại · {disputes.filter(d => d.status === 'pending').length} chờ xử lý</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'investigating', 'resolved', 'rejected'].map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} className="rounded-full" onClick={() => setFilter(f)}>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{dispute.id.slice(0, 8)}</span>
                      <Badge className={config.cls}><StatusIcon className="h-3 w-3 mr-1" />{config.label}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">Đơn: {dispute.orderCode}</span>
                  </div>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{dispute.reason}</p>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>Người mua: <span className="font-medium text-foreground">{dispute.buyerEmail}</span></span>
                    <span>Người bán: <span className="font-medium text-foreground">{dispute.sellerEmail}</span></span>
                  </div>
                  {(dispute.status === 'pending' || dispute.status === 'investigating') && (
                    <div className="flex gap-2 pt-1">
                      {dispute.status === 'pending' && (
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => updateMut.mutate({ id: dispute.id, status: 'investigating' })} disabled={updateMut.isPending}>
                          <Eye className="h-3.5 w-3.5" />Điều tra
                        </Button>
                      )}
                      <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700" onClick={() => updateMut.mutate({ id: dispute.id, status: 'resolved' })} disabled={updateMut.isPending}>
                        <CheckCircle2 className="h-3.5 w-3.5" />Giải quyết
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:bg-destructive/10" onClick={() => updateMut.mutate({ id: dispute.id, status: 'rejected' })} disabled={updateMut.isPending}>
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
