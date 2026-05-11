import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '@/services/api';
import { type Product, type ProductVariant } from '@/types/product';
import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store';
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, ShieldCheck, Truck } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state: any) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await apiService.getProductById(id);
        if (data) {
          setProduct(data);
          if (data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  
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
      quantity: quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1 animate-pulse">
        <div className="h-8 bg-muted rounded w-32 mb-8"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-muted rounded w-full"></div>
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded w-full"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-muted rounded w-1/2"></div>
              <div className="h-12 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 flex-1 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mb-8">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/products">
          <Button>Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden border bg-muted/20">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          {product.isApproved && (
            <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600 border-none px-3 py-1 text-sm">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Hàng Chính Hãng
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current opacity-50" />
              <span className="text-sm font-medium text-foreground ml-1">4.0</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <span className="text-sm text-muted-foreground">
              Đã bán {product.soldCount > 1000 ? `${(product.soldCount/1000).toFixed(1)}k` : product.soldCount}
            </span>
          </div>

          <div className="text-3xl font-bold text-primary mb-8 bg-primary/5 inline-block w-fit px-6 py-3 rounded-xl border border-primary/20">
            {selectedVariant ? formatPrice(selectedVariant.price) : 'Liên hệ'}
          </div>

          {/* Variants Selection */}
          {product.variants.length > 1 && (
            <div className="mb-8 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Tùy chọn</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant: ProductVariant) => {
                  const label = Object.entries(variant.attributes)
                    .map(([_, val]) => val)
                    .join(' - ');

                  return (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                      onClick={() => setSelectedVariant(variant)}
                      className="rounded-lg"
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Số lượng</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-10 w-10"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 text-center font-medium">
                  {quantity}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-10 w-10"
                  onClick={increaseQuantity}
                  disabled={selectedVariant ? quantity >= selectedVariant.stock : true}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedVariant ? `${selectedVariant.stock} sản phẩm có sẵn` : ''}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-auto">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-xl h-14 border-primary text-primary hover:bg-primary/10"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="lg"
              className="flex-1 rounded-xl h-14"
              onClick={handleBuyNow}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              Mua ngay
            </Button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              Miễn phí vận chuyển
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Đổi trả miễn phí 15 ngày
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
