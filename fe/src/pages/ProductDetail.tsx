import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { useSyncedCart } from '@/hooks/useSyncedCart';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import {
  ProductImage,
  ProductRating,
  ProductTrustBadges,
  QuantitySelector,
  VariantSelector,
} from '@/components/product/ProductDetailSections';
import { ProductDetailSkeleton, ProductNotFound } from '@/components/product/ProductDetailStates';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useSyncedCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiService.getProductById(id ?? ''),
    enabled: Boolean(id),
  });

  const selectedVariant = useMemo(() => {
    if (!product?.variants.length) return null;
    return product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  }, [product, selectedVariantId]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      thumbnail: product.thumbnail,
      variantId: selectedVariant.id,
      variantAttributes: selectedVariant.attributes,
      price: selectedVariant.price,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) return <ProductNotFound />;

  return (
    <div className="container mx-auto flex-1 px-4 py-8">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <ProductImage product={product} />

        <div className="flex flex-col">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {product.name}
          </h1>

          <ProductRating soldCount={product.soldCount} />

          <div className="mb-8 inline-block w-fit rounded-xl border border-primary/20 bg-primary/5 px-6 py-3 text-3xl font-bold text-primary">
            {selectedVariant ? formatPrice(selectedVariant.price) : 'Liên hệ'}
          </div>

          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariant?.id ?? null}
            onSelect={setSelectedVariantId}
          />

          {selectedVariant && (
            <QuantitySelector
              quantity={quantity}
              stock={selectedVariant.stock}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => Math.min(selectedVariant.stock, current + 1))}
            />
          )}

          <div className="mt-auto flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 flex-1 rounded-xl border-primary text-primary hover:bg-primary/10"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="lg"
              className="h-14 flex-1 rounded-xl"
              onClick={handleBuyNow}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              Mua ngay
            </Button>
          </div>

          <ProductTrustBadges />
        </div>
      </div>
    </div>
  );
}
