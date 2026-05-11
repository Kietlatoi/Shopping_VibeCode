import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  PackageCheck,
  Users,
  AlertTriangle,
  ScrollText,
  ChevronLeft,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: PackageCheck, label: 'Duyệt sản phẩm', end: false },
  { to: '/admin/users', icon: Users, label: 'Người dùng', end: false },
  { to: '/admin/disputes', icon: AlertTriangle, label: 'Khiếu nại', end: false },
  { to: '/admin/audit-logs', icon: ScrollText, label: 'Nhật ký', end: false },
];

export function AdminLayout() {
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
          <div className="flex items-center gap-2 mt-3 px-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Admin Panel</h2>
          </div>
          <p className="text-xs text-muted-foreground px-2 mt-1">Quản trị hệ thống</p>
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
