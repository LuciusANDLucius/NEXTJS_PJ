import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo">ShopAZ</div>
            <p>Mua sắm thông minh — Chất lượng Việt. Hàng ngàn sản phẩm chính hãng, giao hàng nhanh toàn quốc.</p>
            <div className="footer-social">
              {/* Facebook */}
              <a href="#" title="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" title="Instagram">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* Youtube */}
              <a href="#" title="Youtube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                  <polygon fill="#0f172a" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" title="Twitter">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-col">
            <h4>Sản phẩm</h4>
            <ul>
              <li><Link href="/products">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?cat=sale">Khuyến mãi</Link></li>
              <li><Link href="/products?cat=new">Mới về</Link></li>
              <li><Link href="/products?cat=best">Bán chạy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Thông tin</h4>
            <ul>
              <li><Link href="/about">Giới thiệu</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Theo dõi đơn hàng</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div suppressHydrationWarning className="footer-bottom">
          <span>© {year} ShopAZ. All rights reserved.</span>
          <span>Thiết kế & phát triển với ♥ tại Việt Nam</span>
        </div>
      </div>
    </footer>
  );
}