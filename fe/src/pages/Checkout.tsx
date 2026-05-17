import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSyncedCart } from '@/hooks/useSyncedCart';
import { useNotifications } from '@/hooks/useNotifications';
import { apiService } from '@/services/api';
import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  ChevronLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

type PaymentMethod = 'cod' | 'credit_card';

export function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, clearCart } = useSyncedCart();
  const { success: notifySuccess, error: notifyError } = useNotifications();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: '',
  });

  const isAddressValid =
    address.fullName.trim() !== '' &&
    address.phone.trim() !== '' &&
    address.street.trim() !== '' &&
    address.city.trim() !== '';

  const handlePlaceOrder = async () => {
    if (!isAddressValid) return;
    setIsPlacingOrder(true);
    try {
      await apiService.createOrder({
        items,
        shippingAddress: `${address.fullName}, ${address.phone}, ${address.street}, ${address.ward}, ${address.district}, ${address.city}`,
        paymentMethod,
      });
      setOrderPlaced(true);
      clearCart();
      notifySuccess('Đặt hàng thành công!');
    } catch {
      notifyError('Chưa thể đặt hàng. Vui lòng kiểm tra kết nối và thử lại nhé.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/orders')} className="rounded-xl">
            Xem đơn hàng
          </Button>
          <Button variant="outline" onClick={() => navigate('/products')} className="rounded-xl">
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-8">Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <Button onClick={() => navigate('/products')} className="rounded-xl">
          Xem sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/cart')}>
        <ChevronLeft className="h-4 w-4" />
        Quay lại giỏ hàng
      </Button>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Thanh toán</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Địa chỉ nhận hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  placeholder="0912 345 678"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street">Địa chỉ cụ thể *</Label>
                <Input
                  id="street"
                  placeholder="Số nhà, tên đường"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Phường / Xã</Label>
                <Input
                  id="ward"
                  placeholder="Phường/Xã"
                  value={address.ward}
                  onChange={(e) => setAddress({ ...address, ward: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận / Huyện</Label>
                <Input
                  id="district"
                  placeholder="Quận/Huyện"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="city">Tỉnh / Thành phố *</Label>
                <Input
                  id="city"
                  placeholder="TP. Hồ Chí Minh"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-primary"
                />
                <Banknote className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận được hàng</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="accent-primary"
                />
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Thẻ tín dụng / Ghi nợ</p>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.productName}
                      className="w-14 h-14 object-cover rounded-lg border"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-bold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>

              <Button
                size="lg"
                className="w-full rounded-xl h-12 text-base gap-2"
                disabled={!isAddressValid || isPlacingOrder}
                onClick={handlePlaceOrder}
              >
                {isPlacingOrder && <Loader2 className="h-5 w-5 animate-spin" />}
                {isPlacingOrder ? 'Đang xử lý đơn hàng...' : 'Đặt hàng'}
              </Button>

              {!isAddressValid && (
                <p className="text-xs text-destructive text-center">
                  Vui lòng điền đầy đủ thông tin giao hàng
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
                <ShieldCheck className="h-4 w-4" />
                Giao dịch được bảo mật
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Truck className="h-5 w-5 text-primary shrink-0" />
          Miễn phí vận chuyển toàn quốc
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          Đổi trả miễn phí trong 15 ngày
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <CreditCard className="h-5 w-5 text-primary shrink-0" />
          Thanh toán an toàn, bảo mật
        </div>
      </div>
    </div>
  );
}
