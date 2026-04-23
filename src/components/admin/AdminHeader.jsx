'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { adminMenuData } from '@/data/adminMenu';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (logout) logout();
    else { localStorage.removeItem('user'); localStorage.removeItem('token'); }
    router.replace('/login');
  };

  // Build breadcrumb from pathname
  const buildBreadcrumb = () => {
    const parts = pathname.split('/').filter(Boolean); // ['admin', 'products', '5']
    const crumbs = [{ label: 'Dashboard', href: '/admin' }];
    if (parts.length > 1) {
      const menuItem = adminMenuData.find(m => m.path === `/${parts[0]}/${parts[1]}`);
      if (menuItem) crumbs.push({ label: menuItem.label, href: menuItem.path });
      if (parts.length > 2) {
        const sub = parts[2];
        if (sub === 'create') crumbs.push({ label: 'Thêm mới', href: null });
        else crumbs.push({ label: `#${sub}`, href: null });
      }
    }
    return crumbs;
  };

  const crumbs = buildBreadcrumb();

  return (
    <header suppressHydrationWarning style={{ height: 'auto', minHeight: 72, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid #e2e8f0', zIndex: 10, gap: 20 }}>
      {/* Breadcrumb */}
      <nav suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: '#cbd5e1' }}>›</span>}
            {crumb.href ? (
              <Link href={crumb.href} style={{ color: i === crumbs.length - 1 ? '#0f172a' : '#64748b', fontWeight: i === crumbs.length - 1 ? 600 : 400, textDecoration: 'none' }}>
                {crumb.label}
              </Link>
            ) : (
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right side */}
      <div suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        {/* View store button */}
        <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Xem Shop
          </button>
        </Link>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, borderLeft: '1px solid #e2e8f0' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #38bdf8, #6366f1)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {(user?.fullname || user?.username || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#334155', fontSize: 14, lineHeight: 1.2 }}>{user?.fullname || user?.username || 'Admin'}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{user?.role || user?.user_type || 'admin'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
          onMouseOut={e => e.currentTarget.style.background = '#fef2f2'}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
