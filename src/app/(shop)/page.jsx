'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listProducts } from '@/services/productService';
import { listCategories } from '@/services/categoriesServices';
import ProductCard from '@/components/shop/product/ProductCard';

export default function ShopHomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    listProducts({ limit: 8 })
      .then(res => setProducts(res.data || res || []))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));

    listCategories()
      .then(res => setCategories((res.data || res || []).slice(0, 7)))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ── Hero ──────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div style={{ maxWidth: 580 }}>
            <div className="hero-badge">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Flash Sale – Giảm đến 50%
            </div>
            <h1>
              Mua sắm phong cách<br />
              <span>Chất lượng Việt Nam</span>
            </h1>
            <p>Hàng ngàn sản phẩm thời trang chính hãng. Giao hàng nhanh, đổi trả dễ dàng trong 30 ngày.</p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-lg">
                  Khám phá ngay
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
              </Link>
              <Link href="/about" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', boxShadow: 'none', color: '#fff' }}>
                  Về chúng tôi
              </Link>
            </div>
            <div className="hero-stats">
              {[
                { num: '10K+', label: 'Sản phẩm' },
                { num: '50K+', label: 'Khách hàng' },
                { num: '99%', label: 'Hài lòng' },
                { num: '24/7', label: 'Hỗ trợ' },
              ].map(s => (
                <div key={s.label}>
                  <div className="hero-stat-num">{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────── */}
      {categories.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-title">Danh mục nổi bật</div>
                <div className="section-subtitle">Khám phá theo từng nhóm sản phẩm</div>
              </div>
              <Link href="/products" className="btn btn-ghost btn-sm">
                Xem tất cả →
              </Link>
            </div>
            <div className="category-scroll">
              {categories.map(cat => {
                const catId = cat.cat_id || cat.id;
                const catName = cat.cat_name || cat.name;
                const catSlug = cat.alias || catId;
                return (
                  <Link key={catId} href={`/products?cat=${catSlug}`} className="category-pill">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {catName}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-title">Sản phẩm nổi bật</div>
              <div className="section-subtitle">Những sản phẩm được yêu thích nhất</div>
            </div>
            <Link href="/products" className="btn btn-ghost btn-sm">
              Xem tất cả →
            </Link>
          </div>

          {loadingProducts ? (
            <div className="page-loading">
              <div className="spinner" />
              <span style={{ color: '#64748b', fontSize: 14 }}>Đang tải sản phẩm...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="empty">
              <svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p>Chưa có sản phẩm nào.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => (
                <ProductCard key={p.product_id || p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Trust Banners ────────────────────── */}
      <section style={{ background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 300K' },
              { icon: '↩️', title: 'Đổi trả 30 ngày', desc: 'Không câu hỏi' },
              { icon: '🔒', title: 'Thanh toán an toàn', desc: 'Mã hóa SSL 256-bit' },
              { icon: '💬', title: 'Hỗ trợ 24/7', desc: 'Luôn sẵn sàng phục vụ' },
            ].map(b => (
              <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 28 }}>{b.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
