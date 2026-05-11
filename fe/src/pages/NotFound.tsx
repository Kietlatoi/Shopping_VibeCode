import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <div className="text-[10rem] font-black text-muted/50 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-3">Không tìm thấy trang</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ để tiếp tục mua sắm.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button size="lg" className="rounded-full px-8">
            Về trang chủ
          </Button>
        </Link>
        <Link to="/products">
          <Button size="lg" variant="outline" className="rounded-full px-8">
            Xem sản phẩm
          </Button>
        </Link>
      </div>
    </div>
  );
}
