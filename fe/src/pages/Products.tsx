import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';
import { type Product } from '@/types/product';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const addItem = useCartStore((state: any) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const lowercased = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(p => p.name.toLowerCase().includes(lowercased))
      );
    }
  }, [searchTerm, products]);

  
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add default variant to cart
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
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Tất cả sản phẩm</h1>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
          <Button
            variant="link"
            onClick={() => setSearchTerm('')}
            className="mt-4"
          >
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
    </div>
  );
}
