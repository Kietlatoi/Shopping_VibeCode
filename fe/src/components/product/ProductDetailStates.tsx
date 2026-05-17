import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto flex-1 animate-pulse px-4 py-8">
      <div className="mb-8 h-8 w-32 rounded bg-muted" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square rounded-xl bg-muted" />
        <div className="space-y-6">
          <div className="h-10 w-full rounded bg-muted" />
          <div className="h-6 w-1/3 rounded bg-muted" />
          <div className="h-12 w-1/2 rounded bg-muted" />
          <div className="h-32 w-full rounded bg-muted" />
          <div className="flex gap-4">
            <div className="h-12 w-1/2 rounded bg-muted" />
            <div className="h-12 w-1/2 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductNotFound() {
  return (
    <div className="container mx-auto flex-1 px-4 py-20 text-center">
      <h2 className="mb-4 text-2xl font-bold">Không tìm thấy sản phẩm</h2>
      <p className="mb-8 text-muted-foreground">
        Sản phẩm này có thể đã bị xóa hoặc không tồn tại.
      </p>
      <Link to="/products">
        <Button>Quay lại cửa hàng</Button>
      </Link>
    </div>
  );
}
