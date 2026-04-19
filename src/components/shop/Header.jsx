'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import WeatherWidget from './WeatherWidget';

export default function Header() {
  const { user, logout } = useAuth() || {};
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0);
  const {totalItems}= useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/products', label: 'Sản phẩm' },
    { href: '/pages', label: 'Tin tức' },
    { href: '/about', label: 'Giới thiệu' },
    { href: '/contact', label: 'Liên hệ' },
  ];

  return (
    <header className="site-header" style={{ boxShadow: scrolled ? '0 4px 20px rgba(15,23,42,0.1)' : undefined }}>
      <div className="container">
        <Link href="/" className="logo">ShopAZ</Link>

        <nav className="nav">
          {navLinks.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={isActive ? 'active' : ''}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="header-right">
          <WeatherWidget />

          <div className="search-bar">
            <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input placeholder="Tìm sản phẩm..." />
          </div>

          <Link href="/cart"> {/* 3. Thêm Link để bấm vào icon là sang trang giỏ hàng */}
            <button className="cart-btn" title="Giỏ hàng" style={{ position: 'relative' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              
              {/* 4. Thay cartCount bằng totalItems thực tế */}
              {totalItems > 0 && (
                <span className="cart-badge">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 14,
                }}>
                  {(user.fullname || user.username || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                  {user.fullname || user.username}
                </span>
              </Link>

              {/* Admin button — only for admin role */}
              {(user.role === 'admin' || user.user_type === 'admin') && (
                <Link href="/admin" style={{ textDecoration: 'none' }}>
                  <button
                    className="btn btn-sm"
                    style={{
                      background: 'linear-gradient(135deg, #1e293b, #334155)',
                      color: '#38bdf8',
                      border: '1px solid #334155',
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontWeight: 600, fontSize: 13,
                    }}
                    title="Vào trang quản trị"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin
                  </button>
                </Link>
              )}

              <button className="secondary-btn btn-sm" onClick={() => logout()}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="btn btn-outline btn-sm">Đăng nhập</button>
              </Link>
              <Link href="/register">
                <button className="btn btn-sm">Đăng ký</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}