import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/hooks/useNotifications';
import { Search, Ban, CheckCircle2, Shield, ShoppingBag, User as UserIcon, Loader2 } from 'lucide-react';
import type { User } from '@/types/user';

const roleMap: Record<number, { label: string; icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  1: { label: 'Super Admin', icon: Shield, cls: 'bg-purple-100 text-purple-700' },
  2: { label: 'Admin', icon: Shield, cls: 'bg-purple-100 text-purple-700' },
  3: { label: 'Seller', icon: ShoppingBag, cls: 'bg-blue-100 text-blue-700' },
  4: { label: 'Buyer', icon: UserIcon, cls: 'bg-green-100 text-green-700' },
};

const statusMap: Record<string, { label: string; cls: string }> = {
  active: { label: 'Hoạt động', cls: 'bg-green-100 text-green-700' },
  banned: { label: 'Đã ban', cls: 'bg-red-100 text-red-700' },
  unverified: { label: 'Chưa xác thực', cls: 'bg-yellow-100 text-yellow-700' },
};

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const { success: notifySuccess, error: notifyError } = useNotifications();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: apiService.getAdminUsers,
  });

  const banMutation = useMutation({
    mutationFn: (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user?.status === 'banned') {
        return apiService.unbanUser(userId);
      }
      return apiService.banUser(userId);
    },
    onSuccess: (_data, userId) => {
      const user = users.find((u) => u.id === userId);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      notifySuccess(
        user?.status === 'banned' ? `Đã unban ${user.email}` : `Đã ban ${user?.email}`
      );
    },
    onError: () => notifyError('Thao tác thất bại'),
  });

  const filtered = search
    ? users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} người dùng</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((user) => {
          const role = roleMap[user.roleId] || roleMap[4];
          const status = statusMap[user.status] || statusMap.active;
          const RoleIcon = role.icon;

          return (
            <Card key={user.id} className={user.status === 'banned' ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${role.cls} gap-1`}>
                        <RoleIcon className="h-3 w-3" />
                        {role.label}
                      </Badge>
                      <Badge className={status.cls}>{status.label}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}</span>
                    {user.roleId >= 3 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={`gap-1.5 ${
                          user.status === 'banned'
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-destructive hover:bg-destructive/10'
                        }`}
                        onClick={() => banMutation.mutate(user.id)}
                        disabled={banMutation.isPending}
                      >
                        {user.status === 'banned' ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Unban
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5" />
                            Ban
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
