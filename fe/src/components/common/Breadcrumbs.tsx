import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const labels: Record<string, string> = {
  products: 'Sản phẩm',
  cart: 'Giỏ hàng',
  checkout: 'Thanh toán',
  orders: 'Đơn mua',
  tracking: 'Theo dõi',
  profile: 'Hồ sơ',
  about: 'Về chúng tôi',
  login: 'Đăng nhập',
  register: 'Đăng ký',
  'forgot-password': 'Quên mật khẩu',
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;
  if (['login', 'register'].includes(segments[0])) return null;

  return (
    <nav className="container mx-auto px-4 pt-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary">
            <Home className="h-3.5 w-3.5" />
            Trang chủ
          </Link>
        </li>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const isDynamicId = /^[0-9a-f-]{8,}$/i.test(segment) || segment.startsWith('prod-');
          const label = isDynamicId ? 'Chi tiết' : labels[segment] ?? segment;

          return (
            <li key={path} className="inline-flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" />
              {isLast ? (
                <span className="font-medium text-foreground">{label}</span>
              ) : (
                <Link to={path} className="hover:text-primary">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
