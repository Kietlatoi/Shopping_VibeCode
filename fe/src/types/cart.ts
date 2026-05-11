export interface CartItem {
  id: string; // unique id for cart item (could be variant id)
  productId: string;
  productName: string;
  thumbnail: string;
  variantId?: string;
  variantAttributes?: Record<string, string>;
  price: number;
  quantity: number;
}
