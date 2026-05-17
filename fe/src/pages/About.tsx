import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, PackageCheck, ShieldCheck, Store, Truck } from 'lucide-react';

const values = [
  {
    icon: ShieldCheck,
    title: 'Mua sắm an tâm',
    description: 'Sản phẩm được duyệt trước khi lên sàn, tài khoản bán hàng có phân quyền rõ ràng.',
  },
  {
    icon: Truck,
    title: 'Theo dõi rõ ràng',
    description: 'Đơn hàng có trạng thái từng bước, từ chờ xử lý đến giao thành công.',
  },
  {
    icon: Store,
    title: 'Hỗ trợ người bán',
    description: 'Seller có dashboard riêng để quản lý sản phẩm, tồn kho, đơn hàng và doanh thu.',
  },
];

const stats = [
  ['3', 'vai trò người dùng'],
  ['20+', 'màn hình chức năng'],
  ['5', 'luồng quản trị chính'],
];

export function About() {
  return (
    <div className="flex-1">
      <section className="border-b bg-muted/40">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="w-fit">Shopping VibeCode</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
                Một sàn mua sắm gọn, rõ vai trò, dễ mở rộng.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                VibeCode mô phỏng trải nghiệm marketplace đầy đủ cho người mua,
                người bán và quản trị viên, tập trung vào thao tác nhanh và dữ liệu dễ kiểm soát.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg">Khám phá sản phẩm</Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">Tạo tài khoản</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-xl bg-muted/60 p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border">
              <img
                src="/favicon.svg"
                alt="VibeCode"
                className="mx-auto h-52 w-full bg-muted/40 object-contain p-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">Điều dự án đang giải quyết</h2>
          <p className="mt-3 text-muted-foreground">
            Không chỉ là trang bán hàng tĩnh, dự án có đủ nền tảng để kiểm thử các luồng thương mại điện tử phổ biến.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title}>
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sẵn sàng cho giai đoạn hoàn thiện</h2>
            <p className="mt-3 text-muted-foreground">
              Các luồng chính đã được nối với API, có phân quyền, trạng thái rỗng,
              trạng thái lỗi và trải nghiệm responsive.
            </p>
          </div>
          <div className="space-y-3">
            {['Buyer checkout', 'Seller inventory', 'Admin approval', 'Audit logs'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <PackageCheck className="mt-1 h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Bắt đầu kiểm thử như người dùng thật</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Đăng nhập bằng tài khoản demo, thêm sản phẩm vào giỏ và đặt thử một đơn hàng.
              </p>
            </div>
          </div>
          <Link to="/products">
            <Button>Đi tới cửa hàng</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
