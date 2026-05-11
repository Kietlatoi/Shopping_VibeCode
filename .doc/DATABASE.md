# DATABASE.md

Tài liệu này mô tả cấu trúc cơ sở dữ liệu chi tiết cho dự án Shopee Clone. 
**Hệ quản trị:** PostgreSQL 15+ (Khuyến nghị dùng `UUID` cho khóa chính để tăng tính bảo mật và dễ dàng mở rộng).

---

## 1. Tổng quan Kiến trúc (ERD Overview)

Hệ thống được chia thành các phân vùng (Modules) chính:
1.  **Identity & Access (RBAC):** Quản lý người dùng và phân quyền (Admin/Seller/Buyer).
2.  **Catalog:** Quản lý cửa hàng, danh mục, sản phẩm và các biến thể (SKU).
3.  **Sales & Logistics:** Giỏ hàng, đơn hàng, thanh toán và vận chuyển.
4.  **Support & Moderation:** Tranh chấp, đánh giá và nhật ký hệ thống (Audit Logs).

---

## 2. Chi tiết các bảng (Schema)

### 2.1 Phân quyền & Người dùng (Identity & Access)

#### `roles`
Lưu trữ các cấp độ truy cập hệ thống.
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | 1: Super Admin, 2: Admin, 3: Seller, 4: Buyer |
| `name` | VARCHAR(50) | Tên vai trò |
| `permissions` | JSONB | Danh sách quyền chi tiết (ví dụ: `{"can_approve_product": true}`) |

#### `users`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Mã người dùng duy nhất |
| `email` | VARCHAR(255) | Email đăng nhập (Unique) |
| `password` | VARCHAR(255) | Mật khẩu đã hash (Bcrypt/Argon2) |
| `role_id` | INT (FK) | Liên kết với bảng `roles` |
| `status` | ENUM | `active`, `banned`, `unverified` |

---

### 2.2 Quản lý Sản phẩm & Cửa hàng (Catalog)

#### `shops`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Mã cửa hàng |
| `owner_id` | UUID (FK) | Chủ sở hữu (liên kết bảng `users`) |
| `name` | VARCHAR(255) | Tên gian hàng |
| `rating_vibe` | DECIMAL | Điểm uy tín của shop |

#### `products`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Mã sản phẩm |
| `shop_id` | UUID (FK) | Thuộc cửa hàng nào |
| `name` | VARCHAR(255) | Tên sản phẩm hiển thị |
| `is_approved` | BOOLEAN | **Admin** đã kiểm duyệt hay chưa |
| `deleted_at` | TIMESTAMP | Thời điểm xóa (Soft Delete) |

#### `product_variants` (SKU - Stock Keeping Unit)
Quản lý các biến thể như Màu sắc, Kích thước.
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Mã biến thể cụ thể |
| `product_id` | UUID (FK) | Liên kết sản phẩm gốc |
| `price` | DECIMAL(12,2) | Giá bán của biến thể này |
| `stock` | INT | Số lượng tồn kho thực tế |
| `attributes` | JSONB | Ví dụ: `{"color": "Black", "size": "L"}` |

---

### 2.3 Quản trị & Vận hành (Admin Operations)

#### `disputes` (Khiếu nại/Tranh chấp)
Dành cho Admin xử lý khi có khiếu nại giữa Người mua và Người bán.
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Mã khiếu nại |
| `order_id` | UUID (FK) | Đơn hàng bị khiếu nại |
| `admin_id` | UUID (FK) | Admin chịu trách nhiệm xử lý |
| `status` | ENUM | `pending`, `investigating`, `resolved`, `rejected` |

#### `audit_logs` (Nhật ký hệ thống)
Lưu lại mọi hành động quan trọng để phục vụ hậu kiểm.
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | BIGSERIAL (PK) | Thứ tự log |
| `user_id` | UUID (FK) | Ai thực hiện hành động (Admin/Seller) |
| `action` | VARCHAR(100) | Ví dụ: `BAN_USER`, `DELETE_PRODUCT` |
| `metadata` | JSONB | Chi tiết sự thay đổi (giá trị cũ/mới) |
| `created_at` | TIMESTAMP | Thời điểm thực hiện |

---

## 3. Quy tắc Ràng buộc & Tối ưu

1.  **Tính nhất quán (Transactions):** Mọi thao tác đặt hàng (trừ kho, tạo đơn, trừ tiền) phải được bao bọc trong một Database Transaction.
2.  **Chỉ mục (Indexing):**
    *   `BTREE` trên `users(email)` để đăng nhập nhanh.
    *   `GIN INDEX` trên `products(name)` để tìm kiếm sản phẩm.
    *   `BTREE` trên `product_variants(product_id)` để lấy nhanh các tùy chọn sản phẩm.
3.  **Bảo mật:**
    *   Phân quyền ở mức API (Middleware) dựa trên `role_id`.
    *   Chỉ Admin mới có quyền truy cập vào bảng `audit_logs` và `disputes`.

---

## 4. Bảo trì định kỳ

- [ ] Sao lưu (Backup) dữ liệu tự động hàng ngày.
- [ ] Dọn dẹp dữ liệu rác (VACUUM) hàng tuần để tối ưu tốc độ truy vấn.
- [ ] Kiểm tra lỗi đồng bộ giữa Redis (Cache) và Database chính.