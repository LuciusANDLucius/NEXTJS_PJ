import React from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const id = product.product_id || product.id || product.productId;
  const title = product.product_name || product.name || product.title || 'Sản phẩm';
  const price = product.price ? Number(product.price).toLocaleString('vi-VN') + '₫' : 'Liên hệ';
  const oldPrice = product.price_old ? Number(product.price_old).toLocaleString('vi-VN') + '₫' : null;
  let image = product.image || product.thumbnail || null;
  if (image && !image.startsWith('http')) {
    image = `http://localhost:5000/uploads/${image}`;
  }
  const category = product.cat_name || product.category || null;
  const isNew = product.is_new || false;
  const isSale = oldPrice !== null;

  return (
    <article className="product-card">
      {/* Badge */}
      {isSale && <span className="product-card-badge">Sale</span>}
      {isNew && !isSale && <span className="product-card-badge new">Mới</span>}

      {/* Wishlist */}
      <button className="product-card-wishlist" title="Yêu thích" onClick={(e) => e.preventDefault()}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link href={`/products/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div className="product-card-img">
          {image
            ? <img src={image} alt={title} loading="lazy" />
            : (
              <svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )
          }
        </div>

        {/* Body */}
        <div className="product-card-body">
          {category && <div className="product-card-cat">{category}</div>}
          <div className="title">{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
            <span className="price">{price}</span>
            {oldPrice && <span className="price-old">{oldPrice}</span>}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="product-card-actions">
        <button className="btn btn-sm" style={{ width: '100%' }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </article>
  );
}
