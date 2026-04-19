'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import * as authServices from '@/services/authServices';
import { listOrders } from '@/services/orderServices';

const TABS = [
  { key: 'info', label: '👤 Thông tin', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'orders', label: '📦 Đơn hàng', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'password', label: '🔒 Đổi mật khẩu', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
];

const STATUS_MAP = {
  pending:    { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fffbeb' },
  confirmed:  { label: 'Đã xác nhận',  color: '#3b82f6', bg: '#eff6ff' },
  shipping:   { label: 'Đang giao',    color: '#8b5cf6', bg: '#f5f3ff' },
  delivered:  { label: 'Đã giao',      color: '#10b981', bg: '#ecfdf5' },
  cancelled:  { label: 'Đã huỷ',       color: '#ef4444', bg: '#fef2f2' },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('info');

  // Profile form
  const [profile, setProfile] = useState({ fullname: '', email: '', phone: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password form
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      // Wait a tick for AuthContext to hydrate
      const t = setTimeout(() => {
        if (!localStorage.getItem('token')) router.push('/login');
      }, 300);
      return () => clearTimeout(t);
    }
    if (user) {
      setProfile({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Load orders when tab switches
  useEffect(() => {
    if (tab !== 'orders') return;
    setOrdersLoading(true);
    listOrders({ user_id: user?.user_id || user?.id })
      .then(res => setOrders(res?.data || res || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [tab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      await authServices.updateProfile(profile);
      // Update localStorage to reflect new name
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, ...profile }));
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err?.Message || 'Cập nhật thất bại.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }
    setPassLoading(true);
    try {
      await authServices.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err?.Message || 'Mật khẩu hiện tại không đúng.' });
    } finally {
      setPassLoading(false);
    }
  };

  const togglePass = (field) => setShowPass(p => ({ ...p, [field]: !p[field] }));

  const EyeIcon = ({ show }) => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {show
        ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029M6.343 6.343A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/></>
        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
      }
    </svg>
  );

  const inputStyle = { width: '100%', padding: '11px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', minHeight: '70vh' }}>
      {/* Header Card */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #0284c7)', borderRadius: 16, padding: '30px 36px', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 24, color: '#fff' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, border: '3px solid rgba(255,255,255,0.4)' }}>
          {(user?.fullname || user?.username || 'U')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{user?.fullname || user?.username}</div>
          <div style={{ fontSize: 14, opacity: 0.75 }}>{user?.email}</div>
        </div>
        <button
          onClick={() => { logout(); router.push('/'); }}
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
        >
          Đăng xuất
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar Tabs */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: 'fit-content' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: tab === t.key ? '#eff6ff' : 'transparent',
                color: tab === t.key ? '#0284c7' : '#475569',
                fontWeight: tab === t.key ? 700 : 500,
                fontSize: 14, marginBottom: 4, transition: '0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

          {/* TAB: PROFILE INFO */}
          {tab === 'info' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Thông tin tài khoản</h2>
              {profileMsg && (
                <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14, background: profileMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: profileMsg.type === 'success' ? '#16a34a' : '#dc2626', border: `1px solid ${profileMsg.type === 'success' ? '#86efac' : '#fecaca'}` }}>
                  {profileMsg.type === 'success' ? '✅' : '⚠️'} {profileMsg.text}
                </div>
              )}
              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Username</label>
                    <input value={user?.username || ''} disabled style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Họ và tên</label>
                    <input value={profile.fullname} onChange={e => setProfile({ ...profile, fullname: e.target.value })} style={inputStyle} placeholder="Nhập họ tên..." />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={inputStyle} placeholder="Email..." />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Số điện thoại</label>
                    <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} style={inputStyle} placeholder="Số điện thoại..." />
                  </div>
                </div>
                <button type="submit" disabled={profileLoading} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: profileLoading ? '#94a3b8' : 'linear-gradient(135deg, #0284c7, #6366f1)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: ORDERS */}
          {tab === 'orders' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Đơn hàng của tôi</h2>
              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Đang tải đơn hàng...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                  <p style={{ color: '#64748b', marginBottom: 20 }}>Bạn chưa có đơn hàng nào.</p>
                  <Link href="/products" style={{ display: 'inline-block', padding: '12px 28px', background: '#0284c7', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {orders.map(order => {
                    const status = STATUS_MAP[order.status] || { label: order.status, color: '#64748b', bg: '#f8fafc' };
                    return (
                      <div key={order.order_id || order.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                          <div>
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>Đơn #{order.order_id || order.id}</span>
                            <span style={{ marginLeft: 12, fontSize: 13, color: '#64748b' }}>{new Date(order.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, color: status.color, background: status.bg }}>
                            {status.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 14, color: '#475569', marginBottom: 10 }}>
                          {order.items?.length || 0} sản phẩm
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: 16, color: '#dc2626' }}>
                            {Number(order.total_price || order.total || 0).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: CHANGE PASSWORD */}
          {tab === 'password' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Đổi mật khẩu</h2>
              <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>
              {passMsg && (
                <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14, background: passMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: passMsg.type === 'success' ? '#16a34a' : '#dc2626', border: `1px solid ${passMsg.type === 'success' ? '#86efac' : '#fecaca'}` }}>
                  {passMsg.type === 'success' ? '✅' : '⚠️'} {passMsg.text}
                </div>
              )}
              <form onSubmit={handleChangePassword} style={{ maxWidth: 420 }}>
                {[
                  { field: 'current', name: 'currentPassword', label: 'Mật khẩu hiện tại' },
                  { field: 'new', name: 'newPassword', label: 'Mật khẩu mới' },
                  { field: 'confirm', name: 'confirmPassword', label: 'Xác nhận mật khẩu mới' },
                ].map(({ field, name, label }) => (
                  <div key={name} style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPass[field] ? 'text' : 'password'}
                        required
                        value={passForm[name]}
                        onChange={e => setPassForm({ ...passForm, [name]: e.target.value })}
                        style={{ ...inputStyle, paddingRight: 44 }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePass(field)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                      >
                        <EyeIcon show={showPass[field]} />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={passLoading} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: passLoading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #0284c7)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  {passLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}