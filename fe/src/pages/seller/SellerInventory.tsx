import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import type { Product } from '@/types/product';

interface InventoryItem {
  variantId: string;
  productName: string;
  thumbnail: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
}

export function SellerInventory() {
  const queryClient = useQueryClient();
  const { success: notifySuccess } = useNotifications();
  const [editedStocks, setEditedStocks] = useState<Record<string, string>>({});

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['seller-products'],
    queryFn: apiService.getSellerProducts,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) => apiService.updateSellerVariant(id, { stock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      notifySuccess('Đã cập nhật tồn kho!');
    },
  });

  const items: InventoryItem[] = products.flatMap((p) =>
    p.variants.map((v) => ({
      variantId: v.id,
      productName: p.name,
      thumbnail: p.thumbnail,
      attributes: v.attributes,
      price: v.price,
      stock: v.stock,
    }))
  );

  const handleStockChange = (variantId: string, value: string) => {
    setEditedStocks({ ...editedStocks, [variantId]: value });
  };

  const handleSave = (variantId: string) => {
    const newStock = parseInt(editedStocks[variantId]);
    if (isNaN(newStock) || newStock < 0) return;
    updateMutation.mutate({ id: variantId, stock: newStock });
    const updated = { ...editedStocks };
    delete updated[variantId];
    setEditedStocks(updated);
  };

  const lowStockItems = items.filter((item) => item.stock <= 20);

  if (isLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý kho hàng</h1>
        <p className="text-sm text-muted-foreground mt-1">{items.length} biến thể · {lowStockItems.length} sắp hết hàng</p>
      </div>
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-xl border border-orange-200 bg-orange-50 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">Cảnh báo tồn kho thấp</p>
            <p className="text-xs text-muted-foreground mt-0.5">{lowStockItems.length} biến thể có tồn kho ≤ 20 đơn vị.</p>
          </div>
        </div>
      )}
      <div className="grid gap-3">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="col-span-5">Sản phẩm</div>
          <div className="col-span-2">Phân loại</div>
          <div className="col-span-2 text-right">Giá</div>
          <div className="col-span-2 text-center">Tồn kho</div>
          <div className="col-span-1" />
        </div>
        {items.map((item) => {
          const isEditing = editedStocks[item.variantId] !== undefined;
          const isLowStock = item.stock <= 20;
          return (
            <Card key={item.variantId} className={isLowStock ? 'border-orange-200' : ''}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 flex items-center gap-3">
                    <img src={item.thumbnail} alt={item.productName} className="w-10 h-10 rounded-lg object-cover border shrink-0" loading="lazy" />
                    <span className="font-medium text-sm truncate">{item.productName}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.attributes).map(([key, val]) => (
                        <Badge key={key} variant="secondary" className="text-xs">{val}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-medium text-sm">{formatPrice(item.price)}</div>
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <Input type="number" className="w-20 h-8 text-center text-sm" value={editedStocks[item.variantId] ?? item.stock} onChange={(e) => handleStockChange(item.variantId, e.target.value)} />
                    {isLowStock && !isEditing && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-[10px]">Thấp</Badge>}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {isEditing && <Button size="icon" className="h-8 w-8" onClick={() => handleSave(item.variantId)} disabled={updateMutation.isPending}><Save className="h-3.5 w-3.5" /></Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
