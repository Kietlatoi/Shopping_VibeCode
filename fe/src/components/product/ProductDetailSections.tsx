import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product, ProductVariant } from '@/types/product';
import { Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react';

type ProductImageProps = {
  product: Product;
};

export function ProductImage({ product }: ProductImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted/20">
      <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
      {product.isApproved && (
        <Badge className="absolute left-4 top-4 border-none bg-green-500 px-3 py-1 text-sm hover:bg-green-600">
          <ShieldCheck className="mr-1 h-4 w-4" />
          Hàng chính hãng
        </Badge>
      )}
    </div>
  );
}

export function ProductRating({ soldCount }: { soldCount: number }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex items-center gap-1 text-yellow-500">
        {[0, 1, 2, 3].map((star) => (
          <Star key={star} className="h-5 w-5 fill-current" />
        ))}
        <Star className="h-5 w-5 fill-current opacity-50" />
        <span className="ml-1 text-sm font-medium text-foreground">4.0</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <span className="text-sm text-muted-foreground">
        Đã bán {soldCount > 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}
      </span>
    </div>
  );
}

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
};

export function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  return (
    <div className="mb-8 space-y-4">
      <h3 className="text-sm font-semibold uppercase text-muted-foreground">Tùy chọn</h3>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const label = Object.entries(variant.attributes).map(([, value]) => value).join(' - ');

          return (
            <Button
              key={variant.id}
              variant={selectedVariantId === variant.id ? 'default' : 'outline'}
              onClick={() => onSelect(variant.id)}
              className="rounded-lg"
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

type QuantitySelectorProps = {
  quantity: number;
  stock: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantitySelector({ quantity, stock, onDecrease, onIncrease }: QuantitySelectorProps) {
  return (
    <div className="mb-8 space-y-4">
      <h3 className="text-sm font-semibold uppercase text-muted-foreground">Số lượng</h3>
      <div className="flex items-center gap-4">
        <div className="flex items-center overflow-hidden rounded-lg border">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={onDecrease} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-12 text-center font-medium">{quantity}</div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={onIncrease} disabled={quantity >= stock}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">{stock} sản phẩm có sẵn</span>
      </div>
    </div>
  );
}

export function ProductTrustBadges() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-8">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Truck className="h-5 w-5 text-primary" />
        Miễn phí vận chuyển
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <ShieldCheck className="h-5 w-5 text-primary" />
        Đổi trả miễn phí 15 ngày
      </div>
    </div>
  );
}
