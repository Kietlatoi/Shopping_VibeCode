import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';
import { type Product } from '@/types/product';
import { formatPrice } from '@/utils/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '@/constants';
import { ErrorState } from '@/components/common/ErrorState';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store';
import { useNotifications } from '@/hooks/useNotifications';
import {
  ShoppingCart,
  Star,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
} from 'lucide-react';

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortValue>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const addItem = useCartStore((state) => state.addItem);
  const { success: notifySuccess } = useNotifications();

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset page on search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy]);

  // Filter + sort
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (debouncedSearch.trim()) {
      const lowered = debouncedSearch.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(lowered));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
        break;
      case 'sold':
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'newest':
        result.reverse();
        break;
      default:
        break;
    }

    return result;
  }, [products, debouncedSearch, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
      notifySuccess('Đã thêm vào giỏ hàng!');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex-1">
        <ErrorState
          title="Không thể tải sản phẩm"
          message="Đã xảy ra lỗi khi tải danh sách sản phẩm."
          onRetry={fetchProducts}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tất cả sản phẩm</h1>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">
              {processedProducts.length} sản phẩm
              {debouncedSearch && ` cho "${debouncedSearch}"`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchTerm('')}
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Bộ lọc"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-muted/50 rounded-xl border animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
            Sắp xếp:
          </div>
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={sortBy === option.value ? 'default' : 'outline'}
              className="rounded-full text-xs h-8"
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card shadow-sm h-[350px] animate-pulse">
              <div className="h-[200px] bg-muted rounded-t-xl" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground mb-2">Không tìm thấy sản phẩm nào</p>
          <p className="text-sm text-muted-foreground mb-4">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSortBy('popular');
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group block">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
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
                        | Đã bán{' '}
                        {product.soldCount > 1000
                          ? `${(product.soldCount / 1000).toFixed(1)}k`
                          : product.soldCount}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {product.variants.length > 0
                        ? formatPrice(product.variants[0].price)
                        : 'Liên hệ'}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full gap-2 rounded-xl transition-all duration-300 group-hover:bg-primary cursor-pointer"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                aria-label="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setCurrentPage(i + 1)}
                  className="w-10 h-10"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                aria-label="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
