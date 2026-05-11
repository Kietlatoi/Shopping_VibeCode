import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart3,
  Warehouse,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/seller/products', icon: Package, label: 'Sản phẩm', end: false },
  { to: '/seller/inventory', icon: Warehouse, label: 'Kho hàng', end: false },
  { to: '/seller/orders', icon: ClipboardList, label: 'Đơn hàng', end: false },
  { to: '/seller/revenue', icon: BarChart3, label: 'Doanh thu', end: false },
];

export function SellerLayout() {
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card shrink-0">
        <div className="p-4 border-b">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground w-full justify-start">
              <ChevronLeft className="h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
          <h2 className="text-lg font-bold mt-3 px-2">Kênh Người Bán</h2>
          <p className="text-xs text-muted-foreground px-2">Quản lý cửa hàng</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </div>
    </div>
  );
}
