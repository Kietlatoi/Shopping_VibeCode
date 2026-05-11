import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Mail, MapPin, Phone, Shield, Save } from 'lucide-react';

export function UserProfile() {
  const { user } = useAuthStore();
  const { success: notifySuccess } = useNotifications();

  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifySuccess('Cập nhật thông tin thành công!');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleName = (roleId?: number) => {
    switch (roleId) {
      case 1: return 'Super Admin';
      case 2: return 'Admin';
      case 3: return 'Seller';
      case 4: return 'Buyer';
      default: return 'Buyer';
    }
  };

  const getRoleColor = (roleId?: number) => {
    switch (roleId) {
      case 1:
      case 2: return 'bg-purple-500/15 text-purple-700';
      case 3: return 'bg-blue-500/15 text-blue-700';
      default: return 'bg-green-500/15 text-green-700';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Hồ sơ của tôi</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar — Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{profile.fullName || user?.email?.split('@')[0]}</h3>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
              <Badge className={`mt-3 ${getRoleColor(user?.roleId)}`}>
                <Shield className="h-3 w-3 mr-1" />
                {getRoleName(user?.roleId)}
              </Badge>

              <Separator className="my-6" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.phone}</span>
                  </div>
                )}
                {profile.city && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.city}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main — Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    placeholder="Nguyễn Văn A"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    placeholder="0912 345 678"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-display">Email</Label>
                <Input id="email-display" value={user?.email || ''} disabled className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Địa chỉ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ cụ thể</Label>
                <Input
                  id="address"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Tỉnh / Thành phố</Label>
                <Input
                  id="city"
                  placeholder="TP. Hồ Chí Minh"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 rounded-xl px-8">
              <Save className="h-4 w-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
