'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin' && user.user_type !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  // Still loading auth state
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748b', fontSize: 15 }}>Đang xác thực...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in or not admin
  if (!user || (user.role !== 'admin' && user.user_type !== 'admin')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 24, background: '#f8fafc' }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ color: '#0f172a', margin: 0 }}>Truy cập bị từ chối</h2>
        <p style={{ color: '#64748b', margin: 0, textAlign: 'center', maxWidth: 360 }}>
          Bạn cần đăng nhập với tài khoản <strong>Admin</strong> để truy cập khu vực này.
          <br />
          <span style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, display: 'block' }}>
            Tài khoản cần có <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>user_type = "admin"</code> hoặc <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: 4 }}>role = "admin"</code>
          </span>
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/login" style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Đăng nhập lại
          </a>
          <a href="/" style={{ padding: '10px 24px', background: '#f1f5f9', color: '#334155', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}