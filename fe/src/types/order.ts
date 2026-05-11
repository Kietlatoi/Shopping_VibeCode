import { type User } from './user';
import { type Product, type ProductVariant } from './product';

export interface OrderItem {
  id: string;
  product: Pick<Product, 'id' | 'name' | 'thumbnail'>;
  variant: Pick<ProductVariant, 'id' | 'attributes' | 'price'>;
  quantity: number;
  price: number; // price * quantity
}

export interface Order {
  id: string;
  code: string;
  user: Pick<User, 'id' | 'email'>;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: 'cod' | 'credit_card';
  createdAt: string;
  updatedAt: string;
}
