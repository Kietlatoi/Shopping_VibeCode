# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Tài liệu này hướng dẫn Claude Code làm việc hiệu quả với dự án full-stack gồm **React 19** (frontend) và **Node.js** (backend).

---

## Tổng quan dự án

```
project-root/
├── frontend/          # React 19 (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/   # API calls
│   │   ├── store/      # State management (Zustand)
│   │   └── utils/
│   └── package.json
│
├── backend/           # Node.js (Express / Fastify)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── CLAUDE.md
```

---

## Lệnh phổ biến

### Frontend (React 19)
```bash
cd frontend
npm install          # Cài dependencies
npm run dev          # Chạy dev server
npm run build        # Build production
npm run lint         # Kiểm tra ESLint
npm run preview      # Xem bản build production
npm run test         # Chạy unit tests (cần được cấu hình)
```

### Backend (Node.js) - Cần xác thực
```bash
cd backend
npm install          # Cài dependencies
npm run dev          # Chạy với nodemon (hot reload)
npm start            # Chạy production
npm run lint         # Kiểm tra ESLint
npm run test         # Chạy unit tests
npm run migrate      # Chạy database migrations
npm run seed         # Seed dữ liệu mẫu
```

---

## Công nghệ chính

### Frontend
- **Framework**: React 19
- **Build tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: (Dự đoán) Express hoặc Fastify
- **Database**: (Dự đoán) PostgreSQL hoặc MongoDB
- **Authentication**: JWT

---

## Quy tắc maintain

### Chung
- **Không** commit trực tiếp lên `main` / `master`. Luôn tạo branch theo format: `feat/`, `fix/`, `chore/`, `refactor/`
- Mỗi PR phải có mô tả rõ ràng: **mục tiêu**, **thay đổi chính**, **cách test**
- Giữ file nhỏ — mỗi file/component chỉ nên làm **một việc** (Single Responsibility)
- Xóa code dead (console.log thừa, import không dùng, comment cũ) trước khi commit

### Frontend (React 19)
- Ưu tiên **Server Components** cho data fetching khi có thể
- Dùng `use()` hook cho async data thay vì `useEffect` + state khi phù hợp
- Custom hooks phải có tiền tố `use` và chỉ chứa logic tái sử dụng
- Component không nên vượt quá **150 dòng** — tách nhỏ nếu cần
- Đặt tên component theo **PascalCase**, file theo **kebab-case** hoặc đồng bộ với tên component
- Props phải được định nghĩa rõ ràng (TypeScript interface)
- Tránh prop drilling quá 2 cấp — dùng Context hoặc state manager (Zustand)

### Backend (Node.js)
- Tách biệt **controller** (xử lý request/response) và **service** (business logic)
- Không viết SQL / query trực tiếp trong controller — đưa vào model hoặc repository layer
- Mọi route đều phải có middleware xác thực nếu cần bảo vệ
- Luôn validate input từ client (dùng `zod`, `joi`, hoặc `express-validator`)
- Lỗi phải được xử lý qua **global error handler** — không dùng `try/catch` lặp đi lặp lại mà không re-throw
- Biến môi trường chỉ đọc từ `process.env` thông qua một file config tập trung (vd: `src/config/env.ts`)

---

## Quy tắc scale

### Frontend
- Lazy load route-level components bằng `React.lazy` + `Suspense`
- Code-split theo feature/page, không bundle toàn bộ app vào một chunk
- Dùng **React Query** (TanStack Query) hoặc **SWR** để cache và quản lý server state — không lưu API data vào Zustand
- Tối ưu re-render: dùng `memo`, `useMemo`, `useCallback` đúng chỗ — không dùng bừa bãi
- Hình ảnh phải dùng lazy loading (`loading="lazy"`) và định dạng WebP/AVIF
- Kiểm soát bundle size bằng `vite-bundle-visualizer` hoặc `source-map-explorer`

### Backend
- Thiết kế API theo chuẩn **RESTful** hoặc nhất quán theo chuẩn đã chọn (GraphQL, tRPC)
- Tất cả endpoint đọc dữ liệu lớn phải hỗ trợ **pagination** (cursor-based ưu tiên hơn offset)
- Dùng **caching layer** (Redis) cho dữ liệu đọc nhiều, ít thay đổi
- Background job (email, xử lý file, ...) phải dùng queue (BullMQ, pg-boss) — không xử lý đồng bộ trong request
- Database query phải có index phù hợp — kiểm tra query plan trước khi merge
- Giới hạn rate limit cho các endpoint public và authentication
- Log có cấu trúc (JSON) với đủ context: `requestId`, `userId`, `duration` — dùng `pino` hoặc `winston`

---

## Quản lý môi trường

| Biến | Mô tả |
|------|-------|
| `NODE_ENV` | `development` / `production` / `test` |
| `PORT` | Port chạy backend |
| `DATABASE_URL` | Connection string database |
| `REDIS_URL` | Connection string Redis |
| `JWT_SECRET` | Secret key cho JWT |
| `CORS_ORIGIN` | Domain frontend được phép gọi API |
| `LOG_LEVEL` | `debug` / `info` / `warn` / `error` |

- File `.env` **không** được commit — chỉ commit `.env.example`
- Mỗi môi trường (dev, staging, prod) dùng file `.env` riêng

---

## Testing

### Frontend
- Unit test: **Vitest** + **React Testing Library**
- Tập trung test behavior, không test implementation details
- Snapshot test chỉ dùng cho UI component ổn định

### Backend
- Unit test: **Jest** hoặc **Vitest**
- Integration test cho route quan trọng dùng **supertest**
- Test phải độc lập — không phụ thuộc vào thứ tự chạy, không share state

### Nguyên tắc chung
- Coverage không phải mục tiêu — **test đúng chỗ** quan trọng hơn số %
- Mọi bug fix đều nên có test đi kèm để tránh regression

---

## Conventions khi làm việc với Claude Code

- Khi yêu cầu thêm tính năng, luôn chỉ rõ: **frontend**, **backend**, hay **cả hai**
- Khi refactor, chỉ thay đổi trong phạm vi được yêu cầu — không tự ý refactor code ngoài scope
- Khi tạo file mới, đặt đúng thư mục theo cấu trúc đã định nghĩa ở trên
- Nếu cần cài thêm package, hỏi trước khi thêm dependency mới
- Luôn giữ **backward compatibility** khi thay đổi API contract giữa frontend và backend
- Ưu tiên sửa lỗi hiện tại trước khi thêm tính năng mới

---

## Checklist trước khi merge

- [ ] Code đã qua lint không có lỗi
- [ ] Đã viết / cập nhật test liên quan
- [ ] Không có `console.log` hoặc debug code còn sót
- [ ] Biến môi trường mới đã được thêm vào `.env.example`
- [ ] Migration database (nếu có) đã được tạo và test
- [ ] Không có breaking change nào chưa được thông báo
