import apiClient from './apiClient';
import type { Product } from '@/types/product';
import type { User } from '@/types/user';
import type { Order } from '@/types/order';
import type { Dispute, AuditLog } from '@/types/admin';

export const apiService = {
  // ═══════ Products (Public) ═══════
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getProductsByShop: async (shopId: string): Promise<Product[]> => {
    const response = await apiClient.get(`/shops/${shopId}/products`);
    return response.data;
  },

  // ═══════ Auth ═══════
  login: async (email: string, password: string): Promise<{user: User, token: string} | null> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string): Promise<{user: User, token: string} | null> => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },

  // ═══════ Orders (Buyer) ═══════
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: { items: unknown[]; shippingAddress: string; paymentMethod: string }): Promise<Order> => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  // ═══════ User Profile ═══════
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch('/users/me', data);
    return response.data;
  },

  // ═══════ Seller ═══════
  getSellerProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/seller/products');
    return response.data;
  },

  createSellerProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/seller/products', data);
    return response.data;
  },

  updateSellerVariant: async (id: string, data: { price?: number; stock?: number }): Promise<void> => {
    await apiClient.patch(`/seller/variants/${id}`, data);
  },

  getSellerOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/seller/orders');
    return response.data;
  },

  updateSellerOrderStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/seller/orders/${id}/status`, { status });
  },

  // ═══════ Admin ═══════
  approveProduct: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/products/${id}/approve`);
  },

  rejectProduct: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/products/${id}/reject`);
  },

  getAdminUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  banUser: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/ban`);
  },

  unbanUser: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/unban`);
  },

  getDisputes: async (): Promise<Dispute[]> => {
    const response = await apiClient.get('/admin/disputes');
    return response.data;
  },

  updateDisputeStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/disputes/${id}`, { status });
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await apiClient.get('/admin/audit-logs');
    return response.data;
  },
};
