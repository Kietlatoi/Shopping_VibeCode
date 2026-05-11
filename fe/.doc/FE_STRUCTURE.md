frontend/
├── public/              # Assets tĩnh (logo, favicon)
├── src/
│   ├── assets/          # Hình ảnh, fonts, icons hệ thống
│   ├── components/      # Shared components (Button, Input, Modal, Table)
│   │   ├── common/      # Các UI nhỏ dùng chung toàn dự án
│   │   ├── layout/      # Navbar, Sidebar (User vs Admin), Footer
│   │   └── form/        # Các thành phần form tái sử dụng (Zod integration)
│   ├── config/          # Biến môi trường, cấu hình axios/api client
│   ├── constants/       # Enum roles, status đơn hàng, các hằng số
│   ├── contexts/        # AuthContext (quản lý login/phân quyền), ThemeContext
│   ├── hooks/           # Custom hooks dùng chung (useDebounce, useLocalStorage)
│   ├── features/        # CHỖ QUAN TRỌNG: Chia theo thực thể trong DATABASE.md
│   │   ├── auth/        # Đăng ký, Đăng nhập, Quên mật khẩu
│   │   ├── catalog/     # Danh sách SP, Chi tiết SP, Tìm kiếm (Categories)
│   │   ├── cart/        # Quản lý giỏ hàng cục bộ và đồng bộ
│   │   ├── checkout/    # Quy trình thanh toán, chọn địa chỉ
│   │   ├── user-profile/# Quản lý thông tin cá nhân, địa chỉ của Buyer
│   │   ├── shop-manage/ # Dashboard cho Seller (Quản lý kho, Thêm SP)
│   │   └── admin/       # Dashboard cho Admin (Duyệt SP, Xử lý Dispute, Audit Logs)
│   ├── pages/           # Route-level components (chỉ chứa layout và gọi features)
│   ├── services/        # Các hàm gọi API (giao tiếp với Backend)
│   ├── store/           # Quản lý state toàn cục (Zustand hoặc Redux)
│   ├── types/           # Định nghĩa TypeScript interfaces dựa trên DB Schema
│   └── utils/           # Helper functions (Format tiền tệ, ngày tháng)
├── .env.example
├── package.json
└── vite.config.ts