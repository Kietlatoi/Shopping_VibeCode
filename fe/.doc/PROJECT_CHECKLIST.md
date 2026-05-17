# 📋 Shopping VibeCode — Project Checklist

> **Dự án:** Shopee Clone (VibeCode)  
> **Stack:** React 19 + Vite (FE) | Node.js (BE)  
> **Ngày tạo:** 2026-05-11  
> **Cập nhật lần cuối:** 2026-05-14  
> **Trạng thái tổng quan:** 🟢 Frontend 100% | Backend 100%

---

## Chú thích

| Icon | Ý nghĩa |
|------|---------|
| ✅ | Đã hoàn thành |
| 🟡 | Hoàn thành một phần / Cần cải thiện |
| ❌ | Chưa bắt đầu |
| 🔴 | Quan trọng / Ưu tiên cao |

---

## 1. 🏗️ Cấu trúc dự án & Cấu hình

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 1.1 | Khởi tạo project Vite + React 19 + TypeScript | ✅ | Đã hoàn thành |
| 1.2 | Cấu hình TailwindCSS v4 | ✅ | Đã cài đặt |
| 1.3 | Cài đặt shadcn/ui components | ✅ | Badge, Button, Card, Dialog, DropdownMenu, Input, Label, Separator, Sheet |
| 1.4 | Cài đặt Zustand (state management) | ✅ | Auth + Cart store với persist middleware |
| 1.5 | Cài đặt React Router v7 | ✅ | Full routing 3 layout groups |
| 1.6 | Cài đặt Axios | ✅ | apiClient.ts với interceptors, base URL, Bearer token |
| 1.7 | Cài đặt TanStack Query (React Query) | ✅ | QueryClientProvider + useQuery/useMutation cho luồng chính |
| 1.8 | Cài đặt React Hook Form + Zod | ✅ | Đã dùng trong Login, Register |
| 1.9 | Tạo file `.env.example` | ✅ | Đã tạo .env cho cả FE và BE |
| 1.10 | Tổ chức thư mục theo FE_STRUCTURE.md | ✅ | Có: `constants/`, `hooks/`, `types/`, `utils/`, `services/`, `store/`, `components/common/` |

---

## 2. 🧩 Components (Shared UI)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 2.1 | UI Components (shadcn/ui) | ✅ | Badge, Button, Card, Dialog, DropdownMenu, Input, Label, Separator, Sheet |
| 2.2 | Layout — Navbar | ✅ | Responsive, mobile menu, search, user dropdown, RBAC links |
| 2.3 | Layout — Footer | ✅ | 4 cột, social links, payment icons |
| 2.4 | Layout — BuyerLayout | ✅ | Navbar + Outlet + Footer |
| 2.5 | Layout — Sidebar (Admin) | ✅ | AdminLayout: desktop sidebar + mobile bottom tabs |
| 2.6 | Layout — Sidebar (Seller) | ✅ | SellerLayout: desktop sidebar + mobile bottom tabs |
| 2.7 | Common — Spinner/Loading | ✅ | LoadingSpinner component + skeleton patterns |
| 2.8 | Common — Empty State | ✅ | Inline trong Cart, Orders, Products |
| 2.9 | Common — Error State | ✅ | `ErrorState.tsx` component tái sử dụng (icon, message, retry) |
| 2.10 | Common — Toast/Notification | ✅ | react-hot-toast tích hợp, useNotifications hook |
| 2.11 | Common — Route Guards | ✅ | ProtectedRoute, AdminRoute, SellerRoute |

---

## 3. 📄 Pages (Buyer — Người mua)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 3.1 | Trang chủ (Home) | ✅ | Hero section + Featured products grid |
| 3.2 | Danh sách sản phẩm (Products) | ✅ | Grid, debounce search (300ms), sort, pagination (8/page), ErrorState |
| 3.3 | Chi tiết sản phẩm (ProductDetail) | ✅ | Chọn variant, số lượng, thêm giỏ hàng, mua ngay |
| 3.4 | Giỏ hàng (Cart) | ✅ | CRUD items, tính tổng, navigate → checkout |
| 3.5 | Đơn hàng (Orders) | ✅ | Danh sách đơn, status badges, link → detail/tracking, ErrorState |
| 3.6 | Đăng nhập (Login) | ✅ | RHF + Zod, mock fallback khi backend không chạy |
| 3.7 | Đăng ký (Register) | ✅ | RHF + Zod, confirm password, show/hide toggle |
| 3.8 | Quên mật khẩu (ForgotPassword) | ✅ | Đã tạo form, trạng thái thành công, gọi API forgot-password |
| 3.9 | Trang Checkout (Thanh toán) | ✅ | Địa chỉ, payment method, order summary, success state |
| 3.10 | Trang Hồ sơ cá nhân (UserProfile) | ✅ | Sidebar avatar + role badge, form chỉnh sửa |
| 3.11 | Chi tiết đơn hàng (OrderDetail) | ✅ | Items list, info giao hàng, copy mã đơn, link tracking |
| 3.12 | Theo dõi đơn hàng (OrderTracking) | ✅ | Vertical timeline: pending → processing → shipped → delivered |
| 3.13 | Trang 404 (NotFound) | ✅ | Typography 404, dual CTA (Home/Products) |
| 3.14 | Trang Về chúng tôi (About) | ✅ | Đã tạo trang giới thiệu responsive |

---

## 4. 🛒 Pages (Seller — Người bán)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 4.1 | Dashboard Seller | ✅ | Stats cards, recent orders, low stock alerts |
| 4.2 | Quản lý sản phẩm (CRUD) | ✅ | Search, add dialog, approval badges, delete |
| 4.3 | Quản lý kho (Inventory) | ✅ | Inline stock editing, low-stock warnings (≤20) |
| 4.4 | Quản lý đơn hàng (Seller Orders) | ✅ | Order list, status progression (pending→processing→shipped) |
| 4.5 | Thống kê doanh thu | ✅ | Revenue summary, CSS bar chart, top products ranking |

---

## 5. 🛡️ Pages (Admin — Quản trị)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 5.1 | Dashboard Admin | ✅ | System stats, recent audit logs, health indicator |
| 5.2 | Duyệt sản phẩm (Product Approval) | ✅ | Filter tabs, approve/reject buttons |
| 5.3 | Quản lý người dùng | ✅ | Search, role/status badges, ban/unban toggle |
| 5.4 | Xử lý khiếu nại (Disputes) | ✅ | Filter by status, investigate/resolve/reject workflow |
| 5.5 | Nhật ký hệ thống (Audit Logs) | ✅ | Search, action filter chips, human-readable descriptions |

---

## 6. 🔐 Phân quyền & Bảo mật (RBAC)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 6.1 | Auth Store (Zustand + Persist) | ✅ | Persist middleware, không mất state khi refresh |
| 6.2 | Route Guards (`<ProtectedRoute>`) | ✅ | Redirect → /login nếu chưa auth |
| 6.3 | AdminRoute guard | ✅ | Chỉ roleId 1,2 truy cập được |
| 6.4 | SellerRoute guard | ✅ | Chỉ roleId 3 truy cập được |
| 6.5 | UI Masking theo role | ✅ | Navbar dropdown hiện link tương ứng role |
| 6.6 | Token management (JWT) | ✅ | Lưu hạn token, auto-logout, có endpoint refresh |
| 6.7 | Axios Interceptors | ✅ | Auto Bearer Token, 401 handler trong apiClient.ts |

---

## 7. 🔌 Services & API Integration

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 7.1 | API Client (Axios instance) | ✅ | `apiClient.ts` với baseURL, interceptors |
| 7.2 | API Service | ✅ | `api.ts` đầy đủ endpoints (mock fallback khi BE chưa chạy) |
| 7.3 | Auth API (login, register) | ✅ | Có mock fallback |
| 7.4 | Products API | ✅ | getProducts, getProductById, getProductsByShop |
| 7.5 | Orders API | ✅ | getOrders, getOrderById, createOrder |
| 7.6 | Cart API (sync với server) | ✅ | useSyncedCart đồng bộ get/add/update/remove với backend |
| 7.7 | User Profile API | ✅ | getProfile, updateProfile |
| 7.8 | Seller API | ✅ | CRUD products, update variant, orders |
| 7.9 | Admin API | ✅ | approve/reject, ban/unban, disputes, audit-logs |

---

## 8. 📦 State Management

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 8.1 | Auth Store (Zustand) | ✅ | login/logout với persist |
| 8.2 | Cart Store (Zustand) | ✅ | add/remove/update/clear với persist |
| 8.3 | Auth Persist (localStorage) | ✅ | Không mất state khi refresh |
| 8.4 | Cart Persist (localStorage) | ✅ | Không mất giỏ hàng khi refresh |
| 8.5 | Theme Store (dark mode) | ✅ | Zustand persist + toggle light/dark |

---

## 9. 📐 Types & Constants

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 9.1 | TypeScript Interfaces | ✅ | `src/types/`: product, user, order, cart, admin |
| 9.2 | Constants | ✅ | `src/constants/index.ts`: roles, order status, payment, categories, sort |
| 9.3 | Utility functions | ✅ | `src/utils/formatters.ts`: formatPrice, formatDate, formatShortDate (centralized) |

---

## 10. ⚡ Performance & Optimization

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 10.1 | Code Splitting (React.lazy + Suspense) | ✅ | Tất cả pages lazy-loaded |
| 10.2 | Image Lazy Loading | ✅ | `loading="lazy"` trên tất cả product images |
| 10.3 | Memoization (useMemo, useCallback) | ✅ | `useMemo` cho filtered/sorted products |
| 10.4 | Pagination | ✅ | Products: 8 items/page |
| 10.5 | Search debounce | ✅ | `useDebounce` hook: 300ms delay |

---

## 11. 🎨 UI/UX Quality

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 11.1 | Responsive Design (Mobile/Desktop) | ✅ | Tất cả pages, admin/seller có bottom tabs cho mobile |
| 11.2 | Loading States (Skeleton) | ✅ | Home, Products, Orders, OrderDetail, OrderTracking |
| 11.3 | Empty States | ✅ | Cart, Orders, SellerProducts |
| 11.4 | Error States | ✅ | ErrorState component + tích hợp trong Products, Orders, OrderDetail |
| 11.5 | Dark Mode | ✅ | Toggle trên Navbar, lưu lựa chọn người dùng |
| 11.6 | Toast/Snackbar Notifications | ✅ | react-hot-toast: login, add to cart, order, admin actions |
| 11.7 | Breadcrumb Navigation | ✅ | Breadcrumb tự động theo route buyer/public |
| 11.8 | Product Categories/Filters | ✅ | Sort: giá, bán chạy, mới nhất |

---

## 12. 🧹 Code Quality

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 12.1 | ESLint clean (no errors) | ✅ | `npm run lint` pass |
| 12.2 | Xóa `console.log` / `console.error` | ✅ | Đã loại bỏ trong Phase 2/3 refactor |
| 12.3 | Xóa `any` type | ✅ | Đã xóa explicit any trong source đang lint |
| 12.4 | Tách hàm duplicate (formatPrice) | ✅ | Centralized trong `src/utils/formatters.ts` |
| 12.5 | Component size < 150 lines | ✅ | ProductDetail đã tách component, còn 121 dòng |

---

## 13. 🖥️ Backend (Node.js)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 13.1 | Khởi tạo project Node.js | ✅ | Đã xong (package.json, server.js, .env) |
| 13.2 | Express/Fastify setup | ✅ | Đã setup Express |
| 13.3 | Database (PostgreSQL) setup | ✅ | Đã kết nối qua Sequelize |
| 13.4 | Models/Schema (theo DATABASE.md) | ✅ | Đã tạo Role, User, Shop, Product, Variant, Cart, Order, Dispute, AuditLog |
| 13.5 | Auth routes (login, register) | ✅ | Đã tạo Register & Login APIs |
| 13.6 | Product routes | ✅ | Đã tạo APIs lấy danh sách & chi tiết |
| 13.7 | Order routes | ✅ | Đã tạo APIs đặt hàng (Transaction) & xem lịch sử |
| 13.8 | Admin routes | ✅ | Đã tạo APIs duyệt sản phẩm, quản lý user, logs |
| 13.9 | Middleware (auth, error handler) | ✅ | Đã có Auth protect, restrictTo, Error handler |
| 13.10 | Environment config (.env) | ✅ | Đã tạo .env & .env.example |

---

## 📊 Tổng kết tiến độ

| Module | Hoàn thành | Tổng | % |
|--------|:----------:|:----:|:-:|
| Cấu trúc & Cấu hình | 10 | 10 | 100% |
| Shared Components | 11 | 11 | 100% |
| Pages (Buyer) | 14 | 14 | 100% |
| Pages (Seller) | 5 | 5 | 100% |
| Pages (Admin) | 5 | 5 | 100% |
| RBAC & Bảo mật | 7 | 7 | 100% |
| Services & API | 9 | 9 | 100% |
| State Management | 5 | 5 | 100% |
| Types & Constants | 3 | 3 | 100% |
| Performance | 5 | 5 | 100% |
| UI/UX Quality | 8 | 8 | 100% |
| Code Quality | 5 | 5 | 100% |
| Backend | 10 | 10 | 100% |
| **TỔNG (FE only)** | **87** | **87** | **100%** |
| **TỔNG (FE + BE)** | **97** | **97** | **100%** |

---

## ✅ Còn lại (Frontend)

Không còn mục mở trong checklist hiện tại.

---

## 🚀 Đề xuất ưu tiên tiếp theo

> [!IMPORTANT]
> ### Phase 4 — Backend
> 1. Khởi tạo Express server + PostgreSQL
> 2. Tạo models, routes, controllers theo API_SPEC.md & DATABASE.md
> 3. Kết nối FE ↔ BE (thay thế mock data)
> 4. Implement real JWT authentication

> [!NOTE]
> ### Phase 5 — Polish & Enhancement (FE)
> Đã hoàn thành: TanStack Query, Dark Mode, ForgotPassword, About, Breadcrumb navigation.
