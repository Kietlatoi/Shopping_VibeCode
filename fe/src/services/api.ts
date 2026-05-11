import apiClient from './apiClient';
import type { Product } from '@/types/product';
import type { User } from '@/types/user';
import type { Order } from '@/types/order';

export const apiService = {
  // Products
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

  // Auth
  login: async (email: string, password: string): Promise<{user: User, token: string} | null> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
};

