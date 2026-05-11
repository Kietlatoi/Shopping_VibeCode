# BE_STRUCTURE.md

Cấu trúc thư mục Backend Node.js cho dự án Shopee Clone.

```text
backend/
├── src/
│   ├── config/             # Cấu hình hệ thống (Database, Redis, AWS, JWT)
│   ├── constants/          # Các hằng số, mã lỗi, Enums (Role, Order Status)
│   ├── controllers/        # Xử lý Request/Response (Nhận input, gọi Service, trả kết quả)
│   ├── middlewares/        # Kiểm tra Auth, phân quyền (RBAC), Validate dữ liệu, Error handling
│   ├── models/             # Định nghĩa Schema Database (Sequelize, Prisma hoặc Mongoose)
│   ├── routes/             # Định nghĩa các Endpoints (chia theo modules: auth, products, orders)
│   ├── services/           # Chứa Business Logic (Xử lý nghiệp vụ chính, tính toán, gửi email)
│   ├── repositories/       # Tầng giao tiếp trực tiếp với DB (Query dữ liệu)
│   ├── utils/              # Các hàm bổ trợ (Logger, Bcrypt, Format dữ liệu)
│   ├── types/              # Định nghĩa TypeScript interfaces/types
│   └── app.ts              # Cấu hình chính của Express/Fastify
├── tests/                  # Unit tests & Integration tests
├── migrations/             # Các file thay đổi cấu trúc Database
├── seeds/                  # Dữ liệu mẫu ban đầu (Roles, Admin account)
├── .env.example            # Mẫu các biến môi trường
├── .eslintrc.json          # Quy tắc linting
├── package.json
└── server.ts               # Entry point để chạy server