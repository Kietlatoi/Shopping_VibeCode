# API_SPEC.md

**Base URL:** `https://api.shopee-clone.com/v1`

## 1. Người dùng (Public/Buyer)
- `POST /auth/login`: Đăng nhập.
- `GET /products`: Danh sách sản phẩm.
- `POST /orders`: Đặt hàng (Transaction xử lý kho).

## 2. Người bán (Seller)
- `POST /seller/products`: Tạo sản phẩm (chờ duyệt).
- `PATCH /seller/variants/:id`: Cập nhật giá/tồn kho.

## 3. Quản trị (Admin)
- `PATCH /admin/products/:id/approve`: Duyệt sản phẩm.
- `GET /admin/disputes`: Danh sách khiếu nại.
- `GET /admin/audit-logs`: Xem lịch sử hành động hệ thống.