import { Link } from 'react-router-dom';
import { type CartItem, useCartStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground mb-8">Hãy khám phá thêm các sản phẩm tuyệt vời của chúng tôi.</p>
        <Link to="/products">
          <Button size="lg" className="rounded-full px-8">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Giỏ hàng ({totalItems} sản phẩm)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => {
            const variantLabel = item.variantAttributes
              ? Object.entries(item.variantAttributes)
                  .map(([_, val]) => val)
                  .join(' - ')
              : '';

            return (
              <div key={item.id} className="flex gap-4 p-4 border rounded-xl bg-card">
                <Link to={`/products/${item.productId}`} className="shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link to={`/products/${item.productId}`} className="font-semibold hover:text-primary transition-colors line-clamp-2">
                        {item.productName}
                      </Link>
                      {variantLabel && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Phân loại: {variantLabel}
                        </div>
                      )}
                    </div>
                    <div className="text-right font-bold text-primary whitespace-nowrap">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none hover:bg-muted"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none hover:bg-muted"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <Link to="/products">
              <Button variant="link" className="px-0 text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-card sticky top-24 space-y-6">
            <h3 className="font-bold text-lg border-b pb-4">Tổng đơn hàng</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính ({totalItems} sản phẩm)</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold">Tổng cộng</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary block">{formatPrice(totalPrice)}</span>
                <span className="text-xs text-muted-foreground">(Đã bao gồm VAT)</span>
              </div>
            </div>

            <Button size="lg" className="w-full rounded-xl h-12 text-base">
              Tiến hành đặt hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
