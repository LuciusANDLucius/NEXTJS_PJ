'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ username: '', pass: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      if (res && res.token) {
        if (typeof onSuccess === 'function') onSuccess(res);
      } else {
        setError(res?.message || 'Sai tên đăng nhập hoặc mật khẩu.');
      }
    } catch (err) {
      setError(err?.Message || err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0284c7 100%)',
        padding: 60, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ color: '#fff', maxWidth: 400, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, letterSpacing: -1 }}>ShopAZ</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>Chào mừng<br />trở lại!</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.7 }}>
            Đăng nhập để mua sắm, theo dõi đơn hàng và khám phá hàng ngàn sản phẩm ưu đãi mỗi ngày.
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['🚚 Giao hàng miễn phí', '🔒 Thanh toán an toàn', '↩️ Đổi trả 30 ngày'].map(t => (
              <div key={t} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: 20 }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Đăng nhập</h2>
            <p style={{ color: '#64748b' }}>Chưa có tài khoản? <Link href="/register" style={{ color: '#0284c7', fontWeight: 600 }}>Đăng ký ngay</Link></p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>Tên đăng nhập</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Nhập username..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: '0.2s' }}
              />
            </div>
            <div style={{ marginBottom: 28, position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>Mật khẩu</label>
              <input
                name="pass"
                type={showPass ? 'text' : 'password'}
                value={form.pass}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu..."
                style={{ width: '100%', padding: '12px 48px 12px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: 40, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {showPass
                    ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029M6.343 6.343A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/></>
                    : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                  }
                </svg>
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0284c7, #6366f1)',
                color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: 0.3, transition: '0.3s'
              }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
