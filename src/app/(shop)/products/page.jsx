'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { listProducts } from '@/services/productService';
import { listCategories } from '@/services/categoriesServices';
import ProductCard from '@/components/shop/product/ProductCard';
import Menu from '@/components/shop/Menu';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catsLoaded, setCatsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [inputQ, setInputQ] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [sort, setSort] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [isReady, setIsReady] = useState(false);
  const limit = 12;

  useEffect(() => {
    listCategories().then(res => {
      setCategories(res.data || res || []);
      setCatsLoaded(true);
    });
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const c = p.get('cat');
      const qParam = p.get('q') || p.get('name');
      const s = p.get('sort');
      const min = p.get('price_min');
      const max = p.get('price_max');
      if (c) setActiveCat(c);
      if (qParam) { setInputQ(qParam); setQ(qParam); }
      if (s) setSort(s);
      if (min) setPriceMin(min);
      if (max) setPriceMax(max);
      setIsReady(true);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!catsLoaded) return;
    setLoading(true);
    try {
      const params = { page, limit };
      if (q) params.name = q;
      if (sort) params.sort = sort;
      if (priceMin) params.price_min = priceMin;
      if (priceMax) params.price_max = priceMax;
      
      if (activeCat) {
        const matched = categories.find(c => String(c.alias) === String(activeCat) || String(c.cat_id) === String(activeCat) || c.cat_name === activeCat);
        if (matched) {
          params.category = matched.cat_name;
          params.cat_id = matched.cat_id;
        } else {
          params.category = activeCat;
        }
      }
      const res = await listProducts(params);
      setItems(res.data || res || []);
      setTotalPages(res.totalPage || res.totalPages || res.last_page || 1);
      setTotal(res.total || res.count || 0);
    } catch (e) {
      console.error('fetch products', e);
    } finally {
      setLoading(false);
    }
  }, [page, q, activeCat, catsLoaded, categories]);

  useEffect(() => {
    if (isReady) fetchProducts();
  }, [fetchProducts, isReady]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQ(inputQ);
    // update url
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (inputQ) url.searchParams.set('q', inputQ);
      else url.searchParams.delete('q');
      window.history.pushState({}, '', url);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    setQ(inputQ);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (inputQ) url.searchParams.set('q', inputQ);
      else url.searchParams.delete('q');
      if (sort) url.searchParams.set('sort', sort); else url.searchParams.delete('sort');
      if (priceMin) url.searchParams.set('price_min', priceMin); else url.searchParams.delete('price_min');
      if (priceMax) url.searchParams.set('price_max', priceMax); else url.searchParams.delete('price_max');
      window.history.pushState({}, '', url);
    }
  };

  const handleCatChange = (catId) => {
    setActiveCat(catId);
    setPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (catId) url.searchParams.set('cat', catId);
      else url.searchParams.delete('cat');
      window.history.pushState({}, '', url);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="products-page-header">
        <div className="container">
          <h1>Tất cả sản phẩm</h1>
          <p>Khám phá bộ sưu tập đa dạng với hàng ngàn sản phẩm chất lượng</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              placeholder="Tìm theo tên sản phẩm..."
              value={inputQ}
              onChange={e => setInputQ(e.target.value)}
            />
            <button className="btn" type="submit">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* Body */}
      <div className="container">
        <div className="shop-layout">
          {/* Sidebar */}
          <Menu activeCatId={activeCat} onCatChange={handleCatChange} />

          {/* Main */}
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: '#64748b' }}>
                {loading ? 'Đang tải...' : `${items.length} sản phẩm${q ? ` cho "${q}"` : ''}`}
              </div>
              {(q || activeCat || sort || priceMin || priceMax) && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setQ(''); setInputQ(''); setActiveCat(null); setSort(''); setPriceMin(''); setPriceMax(''); setPage(1);
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      url.search = '';
                      window.history.pushState({}, '', url);
                    }
                  }}
                >
                  ✕ Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Filters toolbar */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="">Sắp xếp mặc định</option>
                  <option value="price_asc">Giá: thấp → cao</option>
                  <option value="price_desc">Giá: cao → thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input placeholder="Giá từ" value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ width: 100 }} />
                <input placeholder="đến" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ width: 100 }} />
                <button className="btn" onClick={handleApplyFilters}>Áp dụng</button>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="page-loading">
                <div className="spinner" />
                <span style={{ color: '#64748b', fontSize: 14 }}>Đang tải sản phẩm...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="empty" style={{ padding: '64px 24px' }}>
                <svg width="56" height="56" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Không tìm thấy sản phẩm</div>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              </div>
            ) : (
              <div className="product-grid">
                {items.map(p => (
                  <ProductCard key={p.product_id || p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(1)}>«</button>
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button
                      key={p}
                      className={page === p ? 'active' : ''}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}

                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <button disabled={page >= totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
