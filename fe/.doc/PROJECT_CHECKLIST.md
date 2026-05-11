# 📋 Shopping VibeCode — Project Checklist

> **Dự án:** Shopee Clone (VibeCode)  
> **Stack:** React 19 + Vite (FE) | Node.js (BE)  
> **Ngày tạo:** 2026-05-11  
> **Trạng thái tổng quan:** 🟡 Đang phát triển (Frontend ~35% | Backend ~0%)

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
| 1.4 | Cài đặt Zustand (state management) | ✅ | Đã dùng cho Auth + Cart store |
| 1.5 | Cài đặt React Router v7 | ✅ | Đã config routing |
| 1.6 | Cài đặt Axios | 🟡 | Đã install nhưng **chưa sử dụng** — đang dùng mock data |
| 1.7 | Cài đặt TanStack Query (React Query) | ❌ 🔴 | Doc yêu cầu bắt buộc cho server state — chưa cài |
| 1.8 | Cài đặt React Hook Form + Zod | ❌ 🔴 | Doc yêu cầu cho form validation — chưa cài |
| 1.9 | Tạo file `.env.example` | ❌ | Chưa tạo theo yêu cầu FE_STRUCTURE |
| 1.10 | Tổ chức thư mục theo FE_STRUCTURE.md | 🟡 | Thiếu nhiều thư mục: `config/`, `constants/`, `contexts/`, `hooks/`, `features/`, `types/`, `utils/` |

---

## 2. 🧩 Components (Shared UI)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 2.1 | UI Components (shadcn/ui) | ✅ | Badge, Button, Card, Dialog, DropdownMenu, Input, Label, Separator, Sheet |
| 2.2 | Layout — Navbar | ✅ | Responsive, có mobile menu, search bar, user dropdown |
| 2.3 | Layout — Footer | ✅ | 4 cột, social links, payment icons |
| 2.4 | Layout — Sidebar (Admin) | ❌ | Chưa tạo |
| 2.5 | Layout — Sidebar (Seller) | ❌ | Chưa tạo |
| 2.6 | Common — Spinner/Loading | 🟡 | Có skeleton loading nhưng chưa có component riêng |
| 2.7 | Common — Empty State | 🟡 | Có inline trong Cart, Orders nhưng chưa tách component |
| 2.8 | Common — Error State | ❌ 🔴 | FE_RULE yêu cầu — chưa có UI xử lý lỗi |
| 2.9 | Common — Toast/Notification | ❌ | Chưa có feedback khi thêm giỏ hàng, đăng nhập... |
| 2.10 | Form — FormField (Zod integration) | ❌ | FE_STRUCTURE yêu cầu — chưa tạo |

---

## 3. 📄 Pages (Buyer — Người mua)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 3.1 | Trang chủ (Home) | ✅ | Hero section + Featured products grid |
| 3.2 | Danh sách sản phẩm (Products) | ✅ | Grid view, tìm kiếm theo tên |
| 3.3 | Chi tiết sản phẩm (ProductDetail) | ✅ | Chọn variant, số lượng, thêm giỏ hàng, mua ngay |
| 3.4 | Giỏ hàng (Cart) | ✅ | CRUD items, tính tổng, order summary |
| 3.5 | Đơn hàng (Orders) | ✅ | Danh sách đơn, trạng thái, chi tiết items |
| 3.6 | Đăng nhập (Login) | ✅ | Form login với mock accounts |
| 3.7 | Đăng ký (Register) | ❌ 🔴 | Có link nhưng chưa tạo trang |
| 3.8 | Quên mật khẩu (ForgotPassword) | ❌ | Có link nhưng chưa tạo trang |
| 3.9 | Trang Checkout (Thanh toán) | ❌ 🔴 | Cart có nút "Đặt hàng" nhưng chưa có flow checkout |
| 3.10 | Trang Hồ sơ cá nhân (UserProfile) | ❌ | Quản lý thông tin, địa chỉ |
| 3.11 | Chi tiết đơn hàng (OrderDetail) | ❌ | Có nút "Xem chi tiết" nhưng chưa tạo trang |
| 3.12 | Theo dõi đơn hàng (OrderTracking) | ❌ | Có nút "Theo dõi đơn hàng" nhưng chưa tạo trang |
| 3.13 | Trang 404 (NotFound) | ❌ | Đang redirect về Home, cần trang riêng |
| 3.14 | Trang Về chúng tôi (About) | ❌ | Có link trong Navbar/Footer nhưng chưa tạo |

---

## 4. 🛒 Pages (Seller — Người bán)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 4.1 | Dashboard Seller | ❌ 🔴 | FE_STRUCTURE yêu cầu `shop-manage/` |
| 4.2 | Quản lý sản phẩm (CRUD) | ❌ | Thêm/sửa/xóa sản phẩm |
| 4.3 | Quản lý kho (Inventory) | ❌ | Cập nhật giá, tồn kho variants |
| 4.4 | Quản lý đơn hàng (Seller Orders) | ❌ | Xử lý đơn hàng của shop |
| 4.5 | Thống kê doanh thu | ❌ | Dashboard charts |

---

## 5. 🛡️ Pages (Admin — Quản trị)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 5.1 | Dashboard Admin | ❌ 🔴 | FE_STRUCTURE yêu cầu `admin/` |
| 5.2 | Duyệt sản phẩm (Product Approval) | ❌ | `PATCH /admin/products/:id/approve` |
| 5.3 | Quản lý người dùng | ❌ | Ban/unban users |
| 5.4 | Xử lý khiếu nại (Disputes) | ❌ | `GET /admin/disputes` |
| 5.5 | Nhật ký hệ thống (Audit Logs) | ❌ | `GET /admin/audit-logs` |

---

## 6. 🔐 Phân quyền & Bảo mật (RBAC)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 6.1 | AuthContext / Auth Store | 🟡 | Zustand store có nhưng **thiếu persist** (mất state khi refresh) |
| 6.2 | Route Guards (`<ProtectedRoute>`) | ❌ 🔴 | FE_RULE yêu cầu — chưa tạo |
| 6.3 | AdminRoute guard | ❌ | Chưa bảo vệ route admin |
| 6.4 | SellerRoute guard | ❌ | Chưa bảo vệ route seller |
| 6.5 | UI Masking theo role | ❌ | Admin/Seller/Buyer thấy UI khác nhau |
| 6.6 | Token management (JWT) | ❌ | Chưa implement refresh token, auto-logout |
| 6.7 | Axios Interceptors (auto Bearer Token, 401 handler) | ❌ 🔴 | FE_RULE yêu cầu — chưa tạo |

---

## 7. 🔌 Services & API Integration

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 7.1 | API Client (Axios instance) | ❌ 🔴 | FE_RULE yêu cầu `src/services/apiClient.ts` — chưa tạo |
| 7.2 | API Service (mock) | 🟡 | Có `api.ts` nhưng dùng mock data, không gọi real API |
| 7.3 | Auth API (login, register, logout) | 🟡 | Chỉ có login mock |
| 7.4 | Products API | 🟡 | Có mock: getProducts, getProductById, getProductsByShop |
| 7.5 | Orders API | 🟡 | Chỉ có getOrders mock |
| 7.6 | Cart API (sync với server) | ❌ | FE_STRUCTURE yêu cầu đồng bộ giỏ hàng |
| 7.7 | User Profile API | ❌ | Chưa tạo |
| 7.8 | Seller API (CRUD products, variants) | ❌ | `POST /seller/products`, `PATCH /seller/variants/:id` |
| 7.9 | Admin API (approve, disputes, audit) | ❌ | Chưa tạo |

---

## 8. 📦 State Management

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 8.1 | Auth Store (Zustand) | ✅ | login/logout actions |
| 8.2 | Cart Store (Zustand) | ✅ | add/remove/update/clear actions |
| 8.3 | Auth Persist (localStorage) | ❌ 🔴 | User bị logout khi refresh page |
| 8.4 | Cart Persist (localStorage) | ❌ | Giỏ hàng bị mất khi refresh |
| 8.5 | Theme Store (dark mode) | ❌ | FE_STRUCTURE yêu cầu `ThemeContext` |

---

## 9. 📐 Types & Constants

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 9.1 | TypeScript Interfaces (Product, User, Order...) | 🟡 | Có nhưng **nằm trong mockdata**, chưa tách riêng vào `src/types/` |
| 9.2 | Constants (roles enum, order status) | ❌ | FE_STRUCTURE yêu cầu `src/constants/` |
| 9.3 | Utility functions (formatPrice, formatDate) | 🟡 | Có nhưng **duplicate** trong mỗi page, chưa tách vào `src/utils/` |

---

## 10. ⚡ Performance & Optimization

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 10.1 | Code Splitting (React.lazy + Suspense) | ❌ 🔴 | FE_RULE yêu cầu — chưa implement |
| 10.2 | Image Lazy Loading | ❌ | FE_RULE yêu cầu `loading="lazy"` — chưa thêm |
| 10.3 | Memoization (useMemo, useCallback) | ❌ | Chưa tối ưu re-render |
| 10.4 | Pagination / Infinite Scroll | ❌ | Products đang load tất cả cùng lúc |
| 10.5 | Search debounce | ❌ | Products search không có debounce |

---

## 11. 🎨 UI/UX Quality

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 11.1 | Responsive Design (Mobile/Desktop) | ✅ | Đã implement responsive |
| 11.2 | Loading States (Skeleton) | ✅ | Home, Products, Orders có skeleton |
| 11.3 | Empty States | ✅ | Cart, Orders có empty state |
| 11.4 | Error States | ❌ 🔴 | Chưa có UI hiển thị lỗi cho user |
| 11.5 | Dark Mode | ❌ | Chưa implement |
| 11.6 | Toast/Snackbar Notifications | ❌ | Không có feedback cho actions |
| 11.7 | Breadcrumb Navigation | ❌ | ProductDetail chỉ có nút "Quay lại" |
| 11.8 | Product Categories/Filters | ❌ | Filter button có nhưng chưa hoạt động |

---

## 12. 🧹 Code Quality

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 12.1 | ESLint clean (no errors) | 🟡 | Chưa kiểm tra |
| 12.2 | Xóa `console.log` / `console.error` | ❌ | Còn nhiều `console.error` trong pages |
| 12.3 | Xóa `any` type | ❌ | Có `(state: any)` trong nhiều chỗ dùng Zustand |
| 12.4 | Tách hàm duplicate (formatPrice) | ❌ | `formatPrice` lặp ở 4 file khác nhau |
| 12.5 | Component size < 150 lines | 🟡 | `ProductDetail.tsx` = 258 dòng, `Products.tsx` = 168 dòng — vượt quá |

---

## 13. 🖥️ Backend (Node.js)

| # | Hạng mục | Trạng thái | Ghi chú |
|---|----------|:----------:|---------|
| 13.1 | Khởi tạo project Node.js | ❌ 🔴 | `server.js` tồn tại nhưng **rỗng** |
| 13.2 | Express/Fastify setup | ❌ | Chưa setup |
| 13.3 | Database (PostgreSQL) setup | ❌ | Chưa kết nối |
| 13.4 | Models/Schema (theo DATABASE.md) | ❌ | Chưa tạo |
| 13.5 | Auth routes (login, register) | ❌ | Chưa tạo |
| 13.6 | Product routes | ❌ | Chưa tạo |
| 13.7 | Order routes | ❌ | Chưa tạo |
| 13.8 | Admin routes | ❌ | Chưa tạo |
| 13.9 | Middleware (auth, error handler) | ❌ | Chưa tạo |
| 13.10 | Environment config (.env) | ❌ | Chưa tạo |

---

## 📊 Tổng kết tiến độ

| Module | Hoàn thành | Tổng | % |
|--------|:----------:|:----:|:-:|
| Cấu trúc & Cấu hình | 5 | 10 | 50% |
| Shared Components | 4 | 10 | 40% |
| Pages (Buyer) | 6 | 14 | 43% |
| Pages (Seller) | 0 | 5 | 0% |
| Pages (Admin) | 0 | 5 | 0% |
| RBAC & Bảo mật | 0 | 7 | 0% |
| Services & API | 0 | 9 | 0% |
| State Management | 2 | 5 | 40% |
| Types & Constants | 0 | 3 | 0% |
| Performance | 0 | 5 | 0% |
| UI/UX Quality | 3 | 8 | 38% |
| Code Quality | 0 | 5 | 0% |
| Backend | 0 | 10 | 0% |
| **TỔNG** | **20** | **96** | **~21%** |

---

## 🚀 Đề xuất ưu tiên phát triển tiếp

> [!IMPORTANT]
> ### Phase 1 — Hoàn thiện nền tảng FE (Ưu tiên cao nhất)
> 1. Tổ chức lại thư mục theo `FE_STRUCTURE.md` (tách types, utils, constants)
> 2. Tạo `apiClient.ts` với Axios interceptors
> 3. Cài đặt TanStack Query, React Hook Form + Zod
> 4. Persist auth/cart state (Zustand middleware)
> 5. Tạo Route Guards (ProtectedRoute, AdminRoute, SellerRoute)
> 6. Code splitting với React.lazy + Suspense

> [!NOTE]
> ### Phase 2 — Hoàn thiện trang Buyer
> 7. Tạo trang Register, ForgotPassword
> 8. Tạo trang Checkout flow
> 9. Tạo trang UserProfile + OrderDetail
> 10. Trang 404 NotFound
> 11. Thêm Toast notifications, Error states

> [!NOTE]
> ### Phase 3 — Seller & Admin
> 12. Seller Dashboard + CRUD sản phẩm
> 13. Admin Dashboard + Duyệt sản phẩm + Audit logs

> [!WARNING]
> ### Phase 4 — Backend
> 14. Khởi tạo Express server + PostgreSQL
> 15. Tạo models, routes, controllers theo API_SPEC.md
> 16. Kết nối FE ↔ BE (thay thế mock data)
