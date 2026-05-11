# BE_RULE.md

Quy tắc phát triển Backend Node.js cho dự án Shopee Clone.

---

## 1. Nguyên tắc thiết kế (Design Principles)

- **Controller-Service Pattern:** 
  - **Controller:** KHÔNG viết logic nghiệp vụ. Chỉ nhận dữ liệu từ request, validate và gọi Service.
  - **Service:** Nơi thực hiện tính toán, kiểm tra điều kiện và xử lý logic.
- **Stateless:** Server không lưu trữ session cục bộ. Mọi xác thực phải thông qua JWT (Stateless Authentication).
- **Single Responsibility:** Mỗi hàm/class chỉ làm một nhiệm vụ duy nhất.

---

## 2. Xử lý Dữ liệu & Database

- **Transactions:** Bắt buộc sử dụng Database Transactions cho quy trình Đặt hàng (Orders) để đảm bảo tính nhất quán giữa kho hàng (Stock) và đơn hàng.
- **Validation:** Sử dụng thư viện `Zod` hoặc `Joi` để validate mọi dữ liệu đầu vào từ Client.
- **Soft Delete:** Không xóa cứng (Hard Delete) dữ liệu người dùng và sản phẩm. Sử dụng cột `deleted_at`.
- **Environment Variables:** Tuyệt đối không hard-code các thông tin nhạy cảm (API Key, DB URL). Tất cả phải nằm trong `.env`.

---

## 3. Phân quyền (RBAC - Role Based Access Control)

- **Middleware:** Sử dụng Middleware `checkRole` để bảo vệ các routes.
  - `checkRole(['admin'])`: Cho các API duyệt sản phẩm, xem Audit Logs.
  - `checkRole(['seller'])`: Cho các API quản lý kho hàng của Shop.
- **Ownership Check:** Khi Seller sửa sản phẩm, phải kiểm tra xem `shop_id` của sản phẩm đó có thuộc về User đang đăng nhập hay không.

---

## 4. Xử lý Lỗi (Error Handling)

- **Global Error Handler:** Sử dụng một middleware tập trung để bắt tất cả các lỗi. Không để lộ stack trace cho Client ở môi trường Production.
- **Custom Error Class:** Tạo các class lỗi như `AppError`, `ValidationError`, `AuthError` với status code phù hợp (400, 401, 403, 404).

---

## 5. Hiệu năng & Bảo mật

- **Caching:** Sử dụng Redis để cache các dữ liệu ít thay đổi nhưng truy cập nhiều (Danh mục sản phẩm, Cấu hình hệ thống).
- **Rate Limiting:** Giới hạn số lượng request từ một IP để chống tấn công Brute-force/DDoS.
- **Logging:** Sử dụng thư viện `Winston` hoặc `Pino` để ghi log hành động của Admin và các lỗi hệ thống vào bảng `audit_logs` hoặc file log.
- **Security Headers:** Sử dụng `helmet` để bảo vệ ứng dụng khỏi các lỗ hổng web phổ biến.

---

## 6. Quy tắc Commit & Code Quality

- **Linting:** Chạy `npm run lint` trước khi đẩy code.
- **Documentation:** Mọi API mới phải được cập nhật vào `API_SPEC.md`.
- **Migrations:** Mọi thay đổi DB phải được thực hiện qua file Migration, không chỉnh sửa trực tiếp trong database server.