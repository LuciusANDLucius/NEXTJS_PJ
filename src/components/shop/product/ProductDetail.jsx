'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  const title = product.product_name || product.name || product.title || '—';
  const price = product.price ? Number(product.price).toLocaleString('vi-VN') + '₫' : 'Liên hệ';
  const oldPrice = product.price_old ? Number(product.price_old).toLocaleString('vi-VN') + '₫' : null;
  let image = product.image || product.thumbnail || null;
  if (image && !image.startsWith('http')) {
    image = `http://localhost:5000/uploads/${image}`;
  }
  const description = product.description || product.content || '';
  const category = product.cat_name || '—';
  const brand = product.brand_name || '—';
  const status = Number(product.status) === 1;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span>›</span>
          <Link href="/products">Sản phẩm</Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 500 }}>{title}</span>
        </nav>

        <div className="product-detail">
          {/* Media */}
          <div className="product-media">
            <div className="product-media-main">
              {image ? (
                <img src={image} alt={title} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <svg width="72" height="72" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span style={{ color: '#94a3b8', fontSize: 14 }}>Chưa có hình ảnh</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            {/* Status badge */}
            <div>
              <span className="tag" style={{ background: status ? '#dcfce7' : '#fee2e2', color: status ? '#16a34a' : '#dc2626' }}>
                {status ? ' Còn hàng' : ' Hết hàng'}
              </span>
            </div>

            <h1>{title}</h1>

            <div className="product-price-row">
              <span className="product-price">{price}</span>
              {oldPrice && <span className="product-price-old">{oldPrice}</span>}
              {oldPrice && (
                <span style={{ padding: '3px 8px', background: '#fee2e2', color: '#dc2626', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                  SALE
                </span>
              )}
            </div>

            <div className="product-divider" />

            {/* Meta */}
            <div className="product-meta">
              <div className="product-meta-row">
                <span className="product-meta-label">Danh mục:</span>
                <span className="product-meta-value">{category}</span>
              </div>
              <div className="product-meta-row">
                <span className="product-meta-label">Thương hiệu:</span>
                <span className="product-meta-value">{brand}</span>
              </div>
              {product.product_id && (
                <div className="product-meta-row">
                  <span className="product-meta-label">Mã SP:</span>
                  <span className="product-meta-value" style={{ color: '#64748b' }}>#{product.product_id}</span>
                </div>
              )}
            </div>

            {description && (
              <>
                <div className="product-divider" />
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75 }}>{description}</p>
              </>
            )}

            <div className="product-divider" />

            {/* Quantity */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 12 }}>Số lượng</div>
              <div className="product-qty-row">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input className="qty-input" type="number" value={qty} min={1} onChange={e => setQty(Math.max(1, Number(e.target.value)))} />
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button className="btn btn-lg" disabled={!status}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {status ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
              <button className="btn btn-outline btn-lg" title="Yêu thích">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { icon: '🚚', text: 'Miễn phí vận chuyển' },
                { icon: '↩️', text: 'Đổi trả 30 ngày' },
                { icon: '🔒', text: 'Thanh toán an toàn' },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
