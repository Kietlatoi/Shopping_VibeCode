# FE_RULE.md

Tài liệu này quy định các tiêu chuẩn và quy tắc phát triển Frontend (React 19) cho dự án Shopee Clone, nhằm đảm bảo tính đồng nhất, hiệu suất và khả năng bảo trì lâu dài.

---

## 1. Kiến trúc Hợp phần (Component Architecture)

- **Atomic Design:** Chia nhỏ component theo cấp độ:
  - `atoms`: Các UI nhỏ nhất (Button, Input, Badge, Spinner).
  - `molecules`: Nhóm các atoms (FormField, SearchBar).
  - `organisms`: Các khối chức năng hoàn chỉnh (Navbar, ProductCard, Sidebar).
- **Kích thước file:** Không để một component vượt quá **150 dòng**. Nếu vượt quá, hãy tách logic ra custom hooks hoặc tách sub-components.
- **Naming Convention:** 
  - Thư mục và File: `PascalCase` (vd: `ProductList/ProductList.tsx`).
  - Props: Sử dụng TypeScript Interface rõ ràng, tránh dùng `any`.

---

## 2. Quản lý Trạng thái (State Management)

- **Server State (Dữ liệu API):** 
  - BẮT BUỘC dùng **TanStack Query (React Query)**. 
  - Không lưu dữ liệu từ API vào global state (Zustand/Redux).
- **Global UI State:** 
  - Dùng **Zustand** cho các trạng thái nhẹ như: đóng/mở sidebar, dark mode, thông tin user hiện tại.
- **Form State:** 
  - Dùng **React Hook Form** kết hợp với **Zod** để validation.

---

## 3. Quy tắc API & Dữ liệu

- **Centralized API:** Tất cả các request phải thông qua `src/services/apiClient.ts` (sử dụng Axios instance).
- **Interceptors:** Tự động đính kèm `Bearer Token` vào header và xử lý lỗi tập trung (vd: tự động logout khi nhận mã 401).
- **Types:** Mỗi endpoint API phải có kiểu dữ liệu trả về tương ứng (định nghĩa trong `src/types/`).

---

## 4. Phân quyền & Bảo mật (RBAC)

- **Route Guards:** Sử dụng các thành phần bọc như `<AdminRoute>`, `<SellerRoute>` để bảo vệ các trang nhạy cảm.
- **UI Masking:** 
  - Admin: Thấy đầy đủ các nút kiểm duyệt và nhật ký hệ thống (`audit_logs`).
  - Seller: Thấy dashboard quản lý kho và đơn hàng của shop.
  - Buyer: Chỉ thấy giỏ hàng và thanh toán.

---

## 5. Tối ưu Hiệu suất (Performance)

- **Code Splitting:** Dùng `React.lazy` và `Suspense` cho các route cấp cao nhất.
- **Hình ảnh:**
  - Luôn sử dụng `loading="lazy"` cho ảnh sản phẩm.
  - Ưu tiên định dạng WebP để giảm dung lượng tải.
- **Rendering:** Hạn chế re-render bằng cách sử dụng `useMemo` và `useCallback` khi xử lý các danh sách lớn hoặc các hàm tính toán phức tạp.

---

## 6. Quy tắc Code (Coding Standards)

- **No Console:** Tuyệt đối không để lại `console.log` trong code production.
- **ESLint/Prettier:** Code phải vượt qua kiểm tra của linter trước khi tạo Pull Request.
- **Comments:** Chỉ comment những logic cực kỳ phức tạp. Code sạch (Clean Code) nên tự giải thích chính nó.

---

## 7. Checklist trước khi Merge (PR Checklist)

- [ ] Đã kiểm tra Responsive (Mobile/Desktop).
- [ ] Các trạng thái Trống (Empty), Đang tải (Loading), và Lỗi (Error) đã được thiết kế.
- [ ] Không có biến môi trường (Environment Variables) nào bị lộ.
- [ ] Đã chạy `npm run lint` và không có lỗi.

## 8. Code cần clean không được báo đỏ