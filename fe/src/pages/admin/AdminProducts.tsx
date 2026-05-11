import { useState } from 'react';
import { mockProducts } from '@/mockdata/products';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import type { Product } from '@/types/product';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const { success: notifySuccess } = useNotifications();

  const handleApprove = (id: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, isApproved: true } : p)));
    notifySuccess('Đã duyệt sản phẩm!');
  };

  const handleReject = (id: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, isApproved: false, deletedAt: new Date().toISOString() } : p)));
    notifySuccess('Đã từ chối sản phẩm');
  };

  const filtered = products.filter((p) => {
    if (filter === 'pending') return !p.isApproved;
    if (filter === 'approved') return p.isApproved;
    return true;
  });

  const pendingCount = products.filter((p) => !p.isApproved).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Duyệt sản phẩm</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {products.length} sản phẩm · {pendingCount} chờ duyệt
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tất cả' : f === 'pending' ? `Chờ duyệt (${pendingCount})` : 'Đã duyệt'}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((product) => (
          <Card key={product.id} className={!product.isApproved ? 'border-orange-200' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover border shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                    <Badge
                      className={
                        product.isApproved
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                      }
                    >
                      {product.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Shop: {product.shopId}</span>
                    <span>{product.variants.length} biến thể</span>
                    <span>
                      Giá: {product.variants.length > 0 ? formatPrice(product.variants[0].price) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!product.isApproved ? (
                    <>
                      <Button
                        size="sm"
                        className="gap-1.5 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(product.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(product.id)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Từ chối
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      Chi tiết
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
