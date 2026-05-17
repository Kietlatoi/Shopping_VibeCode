import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ScrollText, Filter, Loader2 } from 'lucide-react';
import type { AuditLog } from '@/types/admin';

const actionColor: Record<string, string> = {
  APPROVE_PRODUCT: 'bg-green-100 text-green-700',
  REJECT_PRODUCT: 'bg-red-100 text-red-700',
  BAN_USER: 'bg-red-100 text-red-700',
  UNBAN_USER: 'bg-green-100 text-green-700',
  RESOLVE_DISPUTE: 'bg-blue-100 text-blue-700',
  CREATE_PRODUCT: 'bg-purple-100 text-purple-700',
  UPDATE_VARIANT: 'bg-orange-100 text-orange-700',
  DELETE_PRODUCT: 'bg-red-100 text-red-700',
  UPDATE_USER_STATUS: 'bg-orange-100 text-orange-700',
};

function formatLogTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  return `${diffDay} ngày trước`;
}

function describeAction(log: AuditLog): string {
  const m = log.metadata;
  switch (log.action) {
    case 'APPROVE_PRODUCT': return `Duyệt sản phẩm: ${m.productName || m.product_id || ''}`;
    case 'REJECT_PRODUCT': return `Từ chối sản phẩm: ${m.productName || ''} — ${m.reason || ''}`;
    case 'BAN_USER': return `Ban người dùng: ${m.bannedEmail || m.target_user_id || ''}`;
    case 'UNBAN_USER': return `Unban người dùng: ${m.unbannedEmail || ''}`;
    case 'UPDATE_USER_STATUS': return `Cập nhật trạng thái: ${m.target_user_id || ''} → ${m.status || ''}`;
    case 'RESOLVE_DISPUTE': return `Giải quyết khiếu nại ${m.disputeId || m.dispute_id || ''}`;
    case 'CREATE_PRODUCT': return `Tạo sản phẩm mới: ${m.productName || ''}`;
    case 'UPDATE_VARIANT': return `Cập nhật biến thể: ${m.field || ''}: ${m.oldValue || ''} → ${m.newValue || ''}`;
    default: return `${log.action}: ${JSON.stringify(m)}`;
  }
}

export function AdminAuditLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ['admin-audit-logs'],
    queryFn: apiService.getAuditLogs,
  });

  const uniqueActions = [...new Set(logs.map((l) => l.action))];

  const filtered = logs
    .filter((l) => actionFilter === 'all' || l.action === actionFilter)
    .filter((l) => {
      if (!search) return true;
      const lowered = search.toLowerCase();
      return l.userEmail.toLowerCase().includes(lowered) || l.action.toLowerCase().includes(lowered) || describeAction(l).toLowerCase().includes(lowered);
    });

  if (isLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />Nhật ký hệ thống
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{logs.length} bản ghi</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm theo email, hành động..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button size="sm" variant={actionFilter === 'all' ? 'default' : 'outline'} className="rounded-full text-xs h-7" onClick={() => setActionFilter('all')}>Tất cả</Button>
          {uniqueActions.map((action) => (
            <Button key={action} size="sm" variant={actionFilter === action ? 'default' : 'outline'} className="rounded-full text-xs h-7" onClick={() => setActionFilter(action)}>{action}</Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold">#{log.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={actionColor[log.action] || 'bg-gray-100 text-gray-700'}>{log.action}</Badge>
                    <span className="text-xs text-muted-foreground">{formatLogTime(log.createdAt)}</span>
                  </div>
                  <p className="text-sm">{describeAction(log)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Bởi: {log.userEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
