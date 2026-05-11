export const ORDER_STATUS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
} as const;

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-500/15 text-blue-700 border-blue-200',
  shipped: 'bg-orange-500/15 text-orange-700 border-orange-200',
  delivered: 'bg-green-500/15 text-green-700 border-green-200',
  cancelled: 'bg-red-500/15 text-red-700 border-red-200',
};

export const PAYMENT_METHOD = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  credit_card: 'Thẻ tín dụng / Ghi nợ',
} as const;

export const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  SELLER: 3,
  BUYER: 4,
} as const;

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'electronics', name: 'Điện tử' },
  { id: 'fashion', name: 'Thời trang' },
  { id: 'accessories', name: 'Phụ kiện' },
  { id: 'home', name: 'Nhà cửa' },
  { id: 'sports', name: 'Thể thao' },
] as const;

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
  { value: 'sold', label: 'Bán chạy' },
] as const;

export const ITEMS_PER_PAGE = 8;
