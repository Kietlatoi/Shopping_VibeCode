import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import type { Product } from '@/types/product';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSyncedCart } from '@/hooks/useSyncedCart';
import { formatPrice } from '@/utils/formatters';

export function Home() {
  const { addItem } = useSyncedCart();
  const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ['home-products'],
    queryFn: apiService.getProducts,
  });

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      addItem({
        id: defaultVariant.id,
        productId: product.id,
        productName: product.name,
        thumbnail: product.thumbnail,
        variantId: defaultVariant.id,
        variantAttributes: defaultVariant.attributes,
        price: defaultVariant.price,
        quantity: 1,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20 border-b">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-none px-3 py-1">
              Khuyến mãi mùa hè
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Săn Sale Hàng Hiệu <br />
              <span className="text-primary">Giá Siêu Yêu</span>
            </h1>
            <p className="text-lg text-muted-foreground md:max-w-[80%]">
              Khám phá hàng ngàn sản phẩm công nghệ, thời trang và phụ kiện với mức giá ưu đãi nhất thị trường.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="rounded-full px-8">
                Mua sắm ngay
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Xem khuyến mãi
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60"
              alt="Hero shopping"
              className="rounded-2xl shadow-2xl object-cover h-[400px] w-full"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 container mx-auto px-4 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Sản phẩm nổi bật</h2>
          <Link to="/products">
            <Button variant="ghost" className="font-medium text-primary">Xem tất cả</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm h-[350px] animate-pulse">
                <div className="h-[200px] bg-muted rounded-t-xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group block">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.isApproved && (
                      <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 border-none">
                        Chính hãng
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-0 flex-1">
                    <h3 className="font-semibold line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-foreground">4.9</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        | Đã bán {product.soldCount > 1000 ? `${(product.soldCount/1000).toFixed(1)}k` : product.soldCount}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {product.variants.length > 0 ? formatPrice(product.variants[0].price) : 'Liên hệ'}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full gap-2 rounded-xl transition-all duration-300 group-hover:bg-primary"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
