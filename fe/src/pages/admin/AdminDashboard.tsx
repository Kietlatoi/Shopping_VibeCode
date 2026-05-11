import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Users,
  AlertTriangle,
  ScrollText,
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

const stats = [
  { label: 'Chờ duyệt SP', value: 3, icon: PackageCheck, color: 'text-orange-600 bg-orange-100', to: '/admin/products' },
  { label: 'Người dùng', value: 156, icon: Users, color: 'text-blue-600 bg-blue-100', to: '/admin/users' },
  { label: 'Khiếu nại mới', value: 2, icon: AlertTriangle, color: 'text-red-600 bg-red-100', to: '/admin/disputes' },
  { label: 'Đơn hàng hôm nay', value: 42, icon: ShoppingBag, color: 'text-green-600 bg-green-100', to: '/admin' },
];

const recentLogs = [
  { action: 'APPROVE_PRODUCT', user: 'admin@shopeeclone.com', time: '5 phút trước', detail: 'Duyệt: Tai nghe VibeBuds Pro' },
  { action: 'BAN_USER', user: 'admin@shopeeclone.com', time: '1 giờ trước', detail: 'Ban: spam_user@mail.com' },
  { action: 'RESOLVE_DISPUTE', user: 'admin@shopeeclone.com', time: '3 giờ trước', detail: 'Giải quyết khiếu nại #D-003' },
];

const actionColor: Record<string, string> = {
  APPROVE_PRODUCT: 'bg-green-100 text-green-700',
  BAN_USER: 'bg-red-100 text-red-700',
  RESOLVE_DISPUTE: 'bg-blue-100 text-blue-700',
};

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Tổng quan hệ thống</p>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          Hệ thống hoạt động bình thường
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            Hoạt động gần đây
          </CardTitle>
          <Link to="/admin/audit-logs">
            <Button variant="ghost" size="sm" className="text-xs">Xem tất cả</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <Badge className={`shrink-0 ${actionColor[log.action] || 'bg-gray-100 text-gray-700'}`}>
                {log.action}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{log.detail}</p>
                <p className="text-xs text-muted-foreground">{log.user}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
