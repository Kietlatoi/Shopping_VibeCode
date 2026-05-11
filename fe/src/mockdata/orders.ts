import { mockUsers } from './users';
import type { User } from '@/types/user';
import { mockProducts } from './products';
import type { Product, ProductVariant } from '@/types/product';

import { type Order, type OrderItem } from '@/types/order';

// Helper to find a product and variant
const findProductVariant = (productId: string, variantId: string) => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return null;
  const variant = product.variants.find(v => v.id === variantId);
  if (!variant) return null;
  return { product, variant };
};

const user1 = mockUsers[0];

const orderItems1: OrderItem[] = [
  (() => {
    const res = findProductVariant('prod-1', 'var-1-1');
    return {
      id: 'item_1',
      product: { id: res!.product.id, name: res!.product.name, thumbnail: res!.product.thumbnail },
      variant: { id: res!.variant.id, attributes: res!.variant.attributes, price: res!.variant.price },
      quantity: 1,
      price: res!.variant.price * 1,
    };
  })(),
  (() => {
    const res = findProductVariant('prod-2', 'var-2-1');
    return {
      id: 'item_2',
      product: { id: res!.product.id, name: res!.product.name, thumbnail: res!.product.thumbnail },
      variant: { id: res!.variant.id, attributes: res!.variant.attributes, price: res!.variant.price },
      quantity: 2,
      price: res!.variant.price * 2,
    };
  })(),
];

const orderItems2: OrderItem[] = [
    (() => {
    const res = findProductVariant('prod-3', 'var-3-1');
    return {
      id: 'item_3',
      product: { id: res!.product.id, name: res!.product.name, thumbnail: res!.product.thumbnail },
      variant: { id: res!.variant.id, attributes: res!.variant.attributes, price: res!.variant.price },
      quantity: 1,
      price: res!.variant.price * 1,
    };
  })(),
];

export const mockOrders: Order[] = [
  {
    id: 'order_1',
    code: 'DH-20260510-001',
    user: { id: user1.id, email: user1.email },
    items: orderItems1,
    totalAmount: orderItems1.reduce((sum, item) => sum + item.price, 0),
    status: 'delivered',
    shippingAddress: '123 Đường ABC, Phường X, Quận Y, TP.HCM',
    paymentMethod: 'cod',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-05T14:30:00Z',
  },
  {
    id: 'order_2',
    code: 'DH-20260510-002',
    user: { id: user1.id, email: user1.email },
    items: orderItems2,
    totalAmount: orderItems2.reduce((sum, item) => sum + item.price, 0),
    status: 'shipped',
    shippingAddress: '123 Đường ABC, Phường X, Quận Y, TP.HCM',
    paymentMethod: 'credit_card',
    createdAt: '2026-05-08T11:20:00Z',
    updatedAt: '2026-05-09T09:00:00Z',
  },
   {
    id: 'order_3',
    code: 'DH-20260510-003',
    user: { id: user1.id, email: user1.email },
    items: [
        (() => {
            const res = findProductVariant('prod-4', 'var-4-1');
            return {
            id: 'item_4',
            product: { id: res!.product.id, name: res!.product.name, thumbnail: res!.product.thumbnail },
            variant: { id: res!.variant.id, attributes: res!.variant.attributes, price: res!.variant.price },
            quantity: 1,
            price: res!.variant.price * 1,
            };
        })(),
    ],
    totalAmount: findProductVariant('prod-4', 'var-4-1')!.variant.price,
    status: 'pending',
    shippingAddress: '456 Đường DEF, Phường A, Quận B, Hà Nội',
    paymentMethod: 'cod',
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-05-10T08:00:00Z',
  },
];
