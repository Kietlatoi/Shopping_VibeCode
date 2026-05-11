export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  ratingVibe: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  isApproved: boolean;
  deletedAt: string | null;
  variants: ProductVariant[];
  thumbnail: string;
  soldCount: number;
}
