'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
       localStorage.removeItem('user');
       localStorage.removeItem('token');
    }
    router.replace('/login');
  };

  return (
        <header style={{ height: '72px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: 36, height: 36, background: '#38bdf8', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  A
               </div>
               <span style={{ fontWeight: 600, color: '#334155' }}>Xin chào, {user?.username || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
              onMouseOver={(e) => {e.currentTarget.style.background = '#fee2e2'}}
              onMouseOut={(e) => {e.currentTarget.style.background = '#fef2f2'}}
            >
              Đăng xuất
            </button>
          </div>
        </header>
  );
}
