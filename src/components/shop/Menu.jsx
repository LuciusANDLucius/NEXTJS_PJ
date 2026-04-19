'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listCategories } from '@/services/categoriesServices';

export default function Menu({ activeCatId, onCatChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories()
      .then(res => setCategories(res.data || res || []))
      .catch(() => {});
  }, []);

  return (
    <aside className="sidebar">
      <h4>Danh mục</h4>
      <ul className="menu-list">
        <li className={!activeCatId ? 'active' : ''}>
          {onCatChange ? (
            <button onClick={() => onCatChange(null)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Tất cả
            </button>
          ) : (
            <Link href="/products">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Tất cả
            </Link>
          )}
        </li>
        {categories.map(cat => {
          const catId = cat.cat_id || cat.id;
          const catName = cat.cat_name || cat.name;
          const catSlug = cat.alias || catId;
          const isActive = String(activeCatId) === String(catSlug) || String(activeCatId) === String(catId);
          return (
            <li key={catId} className={isActive ? 'active' : ''}>
              {onCatChange ? (
                <button onClick={() => onCatChange(catSlug)}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  {catName}
                </button>
              ) : (
                <Link href={`/products?cat=${catSlug}`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  {catName}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
