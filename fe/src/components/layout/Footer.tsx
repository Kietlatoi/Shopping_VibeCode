import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="bg-primary text-primary-foreground p-1 rounded-md text-sm">VB</span>
              VibeCode
            </h3>
            <p className="text-muted-foreground text-sm">
              Nền tảng mua sắm trực tuyến hàng đầu, mang đến trải nghiệm tuyệt vời và sản phẩm chất lượng cho mọi người.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Về VibeCode</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">Giới thiệu</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Điều khoản</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Chăm sóc khách hàng</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link to="/how-to-buy" className="hover:text-primary transition-colors">Hướng dẫn mua hàng</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Chính sách đổi trả</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Thanh toán</h4>
            <div className="flex gap-2 flex-wrap">
              <div className="w-12 h-8 bg-background border rounded flex items-center justify-center text-xs font-bold text-muted-foreground">VISA</div>
              <div className="w-12 h-8 bg-background border rounded flex items-center justify-center text-xs font-bold text-muted-foreground">JCB</div>
              <div className="w-12 h-8 bg-background border rounded flex items-center justify-center text-xs font-bold text-muted-foreground">COD</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 VibeCode. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
