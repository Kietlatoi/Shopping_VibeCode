import apiClient from './apiClient';
import type { Product } from '@/types/product';
import type { User } from '@/types/user';
import type { Order } from '@/types/order';
import type { Dispute, AuditLog, DashboardStats, SellerStats } from '@/types/admin';
import type { CartItem } from '@/types/cart';

// ═══════ Server Types ═══════

type ServerUser = {
  id: string;
  email: string;
  role_id?: number;
  roleId?: number;
  status: User['status'];
};

type ServerVariant = {
  id: string;
  product_id?: string;
  productId?: string;
  price: string | number;
  stock: number;
  attributes?: Record<string, string>;
  product?: ServerProduct;
};

type ServerShop = {
  id: string;
  owner_id?: string;
  ownerId?: string;
  name: string;
  rating_vibe?: number;
  ratingVibe?: number;
};

type ServerProduct = {
  id: string;
  shop_id?: string;
  shopId?: string;
  name: string;
  image?: string | null;
  thumbnail?: string;
  is_approved?: boolean;
  isApproved?: boolean;
  deleted_at?: string | null;
  deletedAt?: string | null;
  sold_count?: number;
  soldCount?: number;
  variants?: ServerVariant[];
  shop?: ServerShop;
};

type ServerOrderItem = {
  id: string;
  quantity: number;
  price?: string | number;
  price_at_purchase?: string | number;
  variant?: ServerVariant;
  product?: ServerProduct;
};

type ServerOrder = {
  id: string;
  code?: string;
  user?: ServerUser;
  items?: ServerOrderItem[];
  total_price?: string | number;
  totalAmount?: number;
  status: Order['status'];
  shipping_address?: string;
  payment_method?: Order['paymentMethod'];
  created_at?: string;
  updated_at?: string;
};

type ServerCart = {
  items?: Array<{
    id: string;
    quantity: number;
    variant?: ServerVariant;
  }>;
};

type ServerDispute = {
  id: string;
  order_id?: string;
  orderId?: string;
  admin_id?: string | null;
  adminId?: string | null;
  reason?: string;
  status: Dispute['status'];
  buyerEmail?: string;
  sellerEmail?: string;
  orderCode?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ServerAuditLog = {
  id: number;
  user_id?: string;
  userId?: string;
  action: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  createdAt?: string;
  user?: { email: string };
};

// ═══════ Mappers ═══════

const toNumber = (value: string | number | undefined) => Number(value ?? 0);

const mapUser = (user: ServerUser): User => ({
  id: user.id,
  email: user.email,
  roleId: user.roleId ?? user.role_id ?? 4,
  status: user.status,
});

const mapProduct = (product: ServerProduct): Product => ({
  id: product.id,
  shopId: product.shopId ?? product.shop_id ?? product.shop?.id ?? '',
  name: product.name,
  isApproved: product.isApproved ?? product.is_approved ?? false,
  deletedAt: product.deletedAt ?? product.deleted_at ?? null,
  thumbnail: product.thumbnail ?? product.image ?? '/favicon.svg',
  soldCount: product.soldCount ?? product.sold_count ?? 0,
  variants: (product.variants ?? []).map((variant) => ({
    id: variant.id,
    productId: variant.productId ?? variant.product_id ?? product.id,
    price: toNumber(variant.price),
    stock: variant.stock,
    attributes: variant.attributes ?? {},
  })),
});

const mapOrder = (order: ServerOrder): Order => ({
  id: order.id,
  code: order.code ?? `#${order.id.slice(0, 8).toUpperCase()}`,
  user: order.user ? mapUser(order.user) : { id: '', email: '' },
  items: (order.items ?? []).map((item) => {
    const variant = item.variant;
    const product = item.product ?? variant?.product;
    const unitPrice = toNumber(item.price_at_purchase ?? item.price ?? variant?.price);

    return {
      id: item.id,
      product: {
        id: product?.id ?? variant?.product_id ?? '',
        name: product?.name ?? 'Sản phẩm',
        thumbnail: product?.thumbnail ?? product?.image ?? '/favicon.svg',
      },
      variant: {
        id: variant?.id ?? '',
        attributes: variant?.attributes ?? {},
        price: unitPrice,
      },
      quantity: item.quantity,
      price: unitPrice * item.quantity,
    };
  }),
  totalAmount: toNumber(order.totalAmount ?? order.total_price),
  status: order.status,
  shippingAddress: order.shipping_address ?? '',
  paymentMethod: order.payment_method ?? 'cod',
  createdAt: order.created_at ?? new Date().toISOString(),
  updatedAt: order.updated_at ?? new Date().toISOString(),
});

const mapCart = (cart: ServerCart): CartItem[] =>
  (cart.items ?? []).flatMap((item) => {
    const variant = item.variant;
    const product = variant?.product;
    if (!variant || !product) return [];

    return [{
      id: item.id,
      productId: product.id,
      productName: product.name,
      thumbnail: product.thumbnail ?? product.image ?? '/favicon.svg',
      variantId: variant.id,
      variantAttributes: variant.attributes ?? {},
      price: toNumber(variant.price),
      quantity: item.quantity,
    }];
  });

const mapDispute = (d: ServerDispute): Dispute => ({
  id: d.id,
  orderId: d.orderId ?? d.order_id ?? '',
  orderCode: d.orderCode ?? `#${(d.order_id ?? d.orderId ?? '').slice(0, 8).toUpperCase()}`,
  buyerEmail: d.buyerEmail ?? 'N/A',
  sellerEmail: d.sellerEmail ?? 'N/A',
  adminId: d.adminId ?? d.admin_id ?? null,
  reason: d.reason ?? '',
  status: d.status,
  createdAt: d.createdAt ?? d.created_at ?? new Date().toISOString(),
  updatedAt: d.updatedAt ?? d.updated_at ?? new Date().toISOString(),
});

const mapAuditLog = (log: ServerAuditLog): AuditLog => ({
  id: log.id,
  userId: log.userId ?? log.user_id ?? '',
  userEmail: log.user?.email ?? '',
  action: log.action,
  metadata: log.metadata ?? {},
  createdAt: log.createdAt ?? log.created_at ?? new Date().toISOString(),
});

const tokenExpiresAt = (token: string) => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

// ═══════ API Service ═══════

export const apiService = {
  // ═══════ Products (Public) ═══════
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data.data.map(mapProduct);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const response = await apiClient.get(`/products/${id}`);
    return mapProduct(response.data.data);
  },

  getProductsByShop: async (shopId: string): Promise<Product[]> => {
    const response = await apiClient.get(`/shops/${shopId}/products`);
    return response.data.data.map(mapProduct);
  },

  // ═══════ Auth ═══════
  login: async (email: string, password: string): Promise<{user: User, token: string, tokenExpiresAt: number | null} | null> => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { data, token } = response.data;
    return {
      user: mapUser(data.user),
      token,
      tokenExpiresAt: tokenExpiresAt(token),
    };
  },

  register: async (email: string, password: string): Promise<{user: User, token: string, tokenExpiresAt: number | null} | null> => {
    const response = await apiClient.post('/auth/register', { email, password });
    const { data, token } = response.data;
    return {
      user: mapUser(data.user),
      token,
      tokenExpiresAt: tokenExpiresAt(token),
    };
  },

  refreshSession: async (): Promise<{user: User, token: string, tokenExpiresAt: number | null}> => {
    const response = await apiClient.post('/auth/refresh');
    const { data, token } = response.data;
    return {
      user: mapUser(data.user),
      token,
      tokenExpiresAt: tokenExpiresAt(token),
    };
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // ═══════ Orders (Buyer) ═══════
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data.data.map(mapOrder);
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    const response = await apiClient.get(`/orders/${id}`);
    return mapOrder(response.data.data);
  },

  createOrder: async (data: { items: CartItem[]; shippingAddress: string; paymentMethod: string }): Promise<Order> => {
    const response = await apiClient.post('/orders', {
      shipping_address: data.shippingAddress,
      payment_method: data.paymentMethod,
      items: data.items.map((item) => ({
        variant_id: item.variantId ?? item.id,
        quantity: item.quantity,
      })),
    });
    return mapOrder(response.data.data);
  },

  confirmDelivery: async (id: string): Promise<void> => {
    await apiClient.patch(`/orders/${id}/confirm-delivery`);
  },

  // ═══════ Cart ═══════
  getCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get('/cart');
    return mapCart(response.data.data);
  },

  addCartItem: async (variantId: string, quantity: number): Promise<void> => {
    await apiClient.post('/cart', { variant_id: variantId, quantity });
  },

  updateCartItem: async (cartItemId: string, quantity: number): Promise<void> => {
    await apiClient.patch(`/cart/${cartItemId}`, { quantity });
  },

  removeCartItem: async (cartItemId: string): Promise<void> => {
    await apiClient.delete(`/cart/${cartItemId}`);
  },

  // ═══════ User Profile ═══════
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return mapUser(response.data.data);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch('/users/me', data);
    return mapUser(response.data.data);
  },

  // ═══════ Seller ═══════
  getSellerProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/seller/products');
    return response.data.data.map(mapProduct);
  },

  createSellerProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/seller/products', data);
    return mapProduct(response.data.data);
  },

  updateSellerVariant: async (id: string, data: { price?: number; stock?: number }): Promise<void> => {
    await apiClient.patch(`/seller/variants/${id}`, data);
  },

  getSellerOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/seller/orders');
    return response.data.data.map(mapOrder);
  },

  updateSellerOrderStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/seller/orders/${id}/status`, { status });
  },

  getSellerStats: async (): Promise<SellerStats> => {
    const response = await apiClient.get('/seller/stats');
    return response.data.data;
  },

  // ═══════ Admin ═══════
  getAdminProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products?limit=100');
    return response.data.data.map(mapProduct);
  },

  approveProduct: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/products/${id}/approve`, { is_approved: true });
  },

  rejectProduct: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/products/${id}/approve`, { is_approved: false });
  },

  getAdminUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data.data.map(mapUser);
  },

  banUser: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/status`, { status: 'banned' });
  },

  unbanUser: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/status`, { status: 'active' });
  },

  getDisputes: async (): Promise<Dispute[]> => {
    const response = await apiClient.get('/admin/disputes');
    return response.data.data.map(mapDispute);
  },

  updateDisputeStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/disputes/${id}`, { status });
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await apiClient.get('/admin/audit-logs');
    return response.data.data.map(mapAuditLog);
  },

  getAdminDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },
};
