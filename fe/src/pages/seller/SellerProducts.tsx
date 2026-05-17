import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/useNotifications';
import { Plus, Pencil, Trash2, Search, Package, Loader2 } from 'lucide-react';
import type { Product } from '@/types/product';

export function SellerProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { success: notifySuccess } = useNotifications();
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['seller-products'],
    queryFn: apiService.getSellerProducts,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => apiService.createSellerProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      setNewProduct({ name: '', price: '', stock: '' });
      setDialogOpen(false);
      notifySuccess('Đã thêm sản phẩm! Chờ Admin duyệt.');
    },
  });

  const filtered = search ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : products;

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) return;
    createMutation.mutate({
      name: newProduct.name,
      variants: [{ id: '', productId: '', price: parseInt(newProduct.price) || 100000, stock: parseInt(newProduct.stock) || 10, attributes: { color: 'Default' } }],
    } as Partial<Product>);
  };

  if (isLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} sản phẩm</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" />Thêm sản phẩm
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Thêm sản phẩm mới</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Tên sản phẩm *</Label>
                <Input id="product-name" placeholder="Nhập tên sản phẩm" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Giá (VND)</Label>
                  <Input id="product-price" type="number" placeholder="100000" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Tồn kho</Label>
                  <Input id="product-stock" type="number" placeholder="10" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Sản phẩm mới sẽ ở trạng thái "Chờ duyệt" cho đến khi Admin phê duyệt.</p>
              <Button className="w-full" onClick={handleAddProduct} disabled={!newProduct.name.trim() || createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Tạo sản phẩm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Chưa có sản phẩm nào</p>
          <p className="text-sm text-muted-foreground mt-1">Thêm sản phẩm đầu tiên cho cửa hàng của bạn</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <img src={product.thumbnail} alt={product.name} className="w-16 h-16 rounded-lg object-cover border shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <Badge className={product.isApproved ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'}>
                        {product.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{product.variants.length > 0 ? formatPrice(product.variants[0].price) : 'N/A'}</span>
                      <span>Tồn kho: {product.variants.reduce((sum, v) => sum + v.stock, 0)}</span>
                      <span>Đã bán: {product.soldCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Sửa sản phẩm"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" aria-label="Xóa sản phẩm"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
