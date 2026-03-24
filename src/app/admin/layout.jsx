'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { adminMenuData } from '@/data/adminMenu';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.user_type !== 'admin') {
        router.replace('/'); 
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.user_type !== 'admin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h3>Đang xác thực quyền Admin...</h3>
      </div>
    );
  }

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
       localStorage.removeItem('user');
       localStorage.removeItem('token');
    }
    router.replace('/login');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ flexShrink: 0, width: '260px', height: '100vh', background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 8px rgba(0,0,0,0.1)', zIndex: 20 }}>
        <div style={{ padding: '24px', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #334155', textAlign: 'center', letterSpacing: '2px', color: '#38bdf8' }}>
          SHOP ADMIN
        </div>
        <nav style={{ flex: 1, padding: '24px 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {adminMenuData.map((menu) => {
              const isActive = pathname === menu.path || (menu.path !== '/admin' && pathname.startsWith(menu.path));
              return (
                <li key={menu.path} style={{ marginBottom: '8px' }}>
                  <Link href={menu.path} style={{ 
                      display: 'flex', alignItems: 'center', padding: '12px 24px', 
                      textDecoration: 'none', color: isActive ? '#fff' : '#94a3b8', 
                      background: isActive ? '#334155' : 'transparent', 
                      borderLeft: isActive ? '4px solid #38bdf8' : '4px solid transparent', 
                      transition: 'all 0.2s', fontWeight: isActive ? '600' : '400' 
                    }}>
                    <svg style={{ width: '22px', height: '22px', marginRight: '14px', stroke: isActive ? '#38bdf8' : 'currentColor' }} fill="none" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}></path>
                    </svg>
                    {menu.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ height: '72px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ width: 36, height: 36, background: '#38bdf8', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  A
               </div>
               <span style={{ fontWeight: 600, color: '#334155' }}>Xin chào, {user.username || 'Admin'}</span>
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

        {/* Dynamic Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}