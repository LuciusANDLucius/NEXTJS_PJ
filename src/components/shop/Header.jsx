'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext'


export default function Header() {
  const { user, logout } = useAuth() || {}

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">ShopAZ</div>

        <nav className="nav">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="header-right">
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              placeholder="Tìm sản phẩm..."
              style={{ border: 0, outline: 0, background: 'transparent', marginLeft: '8px' }}
            />
          </div>

          {user ? (
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontWeight:600}}>{user.fullname || user.username}</div>
              <button className="secondary-btn" onClick={() => logout()}>Đăng xuất</button>
            </div>
          ) : (
            <>
              <a href="/login" style={{textDecoration:'none'}}><button className="btn" style={{background:'transparent',color:'var(--accent-600)',border:'1px solid var(--accent-600)'}}>Đăng nhập</button></a>
              <a href="/register" style={{textDecoration:'none'}}><button className="btn">Đăng ký</button></a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}