import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';
import { SellerRoute } from './components/common/SellerRoute';
import { RouteLoadingBar } from './components/common/RouteLoadingBar';
import { useAuthStore } from './store';

// Shared layout wrapper for buyer pages
const BuyerLayout = lazy(() => import('./components/layout/BuyerLayout').then(m => ({ default: m.BuyerLayout })));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const SellerLayout = lazy(() => import('./components/layout/SellerLayout').then(m => ({ default: m.SellerLayout })));

// Buyer Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const OrderDetail = lazy(() => import('./pages/OrderDetail').then(m => ({ default: m.OrderDetail })));
const OrderTracking = lazy(() => import('./pages/OrderTracking').then(m => ({ default: m.OrderTracking })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const UserProfile = lazy(() => import('./pages/UserProfile').then(m => ({ default: m.UserProfile })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Seller Pages
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard').then(m => ({ default: m.SellerDashboard })));
const SellerProducts = lazy(() => import('./pages/seller/SellerProducts').then(m => ({ default: m.SellerProducts })));
const SellerInventory = lazy(() => import('./pages/seller/SellerInventory').then(m => ({ default: m.SellerInventory })));
const SellerOrders = lazy(() => import('./pages/seller/SellerOrders').then(m => ({ default: m.SellerOrders })));
const SellerRevenue = lazy(() => import('./pages/seller/SellerRevenue').then(m => ({ default: m.SellerRevenue })));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminDisputes = lazy(() => import('./pages/admin/AdminDisputes').then(m => ({ default: m.AdminDisputes })));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs').then(m => ({ default: m.AdminAuditLogs })));

function LoadingSpinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Đang tải...</p>
    </div>
  );
}

function SessionWatcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (isAuthenticated && isTokenExpired()) {
      logout();
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, isTokenExpired, location.pathname, logout, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <SessionWatcher />
      <RouteLoadingBar />
      <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
        <Toaster position="top-center" reverseOrder={false} />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* ══════════ Seller Panel ══════════ */}
            <Route element={<SellerRoute />}>
              <Route element={<SellerLayout />}>
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<SellerProducts />} />
                <Route path="/seller/inventory" element={<SellerInventory />} />
                <Route path="/seller/orders" element={<SellerOrders />} />
                <Route path="/seller/revenue" element={<SellerRevenue />} />
              </Route>
            </Route>

            {/* ══════════ Admin Panel ══════════ */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/disputes" element={<AdminDisputes />} />
                <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
              </Route>
            </Route>

            {/* ══════════ Buyer / Public ══════════ */}
            <Route element={<BuyerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/orders/:id/tracking" element={<OrderTracking />} />
                <Route path="/profile" element={<UserProfile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
