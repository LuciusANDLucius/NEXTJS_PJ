'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function validateRegister(form) {
  const errs = {};
  if (!form.username.trim()) errs.username = 'Vui lòng nhập username.';
  else if (form.username.trim().length < 3) errs.username = 'Username phải có ít nhất 3 ký tự.';
  if (!form.fullname.trim()) errs.fullname = 'Vui lòng nhập họ tên.';
  if (!form.email.trim()) errs.email = 'Vui lòng nhập email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không hợp lệ.';
  if (!form.pass) errs.pass = 'Vui lòng nhập mật khẩu.';
  else if (form.pass.length < 6) errs.pass = 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (form.pass !== form.confirmPass) errs.confirmPass = 'Mật khẩu xác nhận không khớp.';
  return errs;
}

export default function RegisterForm({ onSuccess }) {
  const { register: authRegister } = useAuth();
  const [form, setForm] = useState({ username: '', fullname: '', email: '', pass: '', confirmPass: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errs = validateRegister(form);
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    try {
      const { confirmPass, ...payload } = form;
      const res = await authRegister(payload);
      if (res && (res.user || res.message === 'success' || res.status === 'success')) {
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => { if (typeof onSuccess === 'function') onSuccess(res); }, 1500);
      } else {
        setError(res?.message || 'Đăng ký thất bại. Tên đăng nhập hoặc email có thể đã tồn tại.');
      }
    } catch (err) {
      setError(err?.Message || err?.message || 'Lỗi server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, extra }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', marginBottom: 7, fontSize: 14, fontWeight: 600, color: '#334155' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          name={name}
          type={type === 'password' && name === 'pass' && showPass ? 'text' : type}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '11px 16px', borderRadius: 10,
            border: `1.5px solid ${fieldErrors[name] ? '#fca5a5' : '#e2e8f0'}`,
            fontSize: 14, outline: 'none', boxSizing: 'border-box', background: fieldErrors[name] ? '#fef2f2' : '#fff'
          }}
        />
        {extra}
      </div>
      {fieldErrors[name] && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 5 }}>{fieldErrors[name]}</div>}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #6366f1 100%)',
        padding: 60, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ color: '#fff', maxWidth: 380, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 16 }}>ShopAZ</div>
          <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>Tạo tài khoản<br />ngay hôm nay</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>Đăng ký miễn phí để mua sắm thông minh, theo dõi đơn hàng và nhận ưu đãi độc quyền.</p>
          <div style={{ marginTop: 48 }}>
            {[
              { icon: '✅', title: 'Đăng ký nhanh chóng', sub: 'Chỉ mất 1 phút' },
              { icon: '🎁', title: 'Ưu đãi thành viên mới', sub: 'Giảm đến 20% đơn hàng đầu' },
              { icon: '🔔', title: 'Thông báo đơn hàng', sub: 'Cập nhật realtime' },
            ].map(({ icon, title, sub }) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Tạo tài khoản</h2>
            <p style={{ color: '#64748b' }}>Đã có tài khoản? <Link href="/login" style={{ color: '#6366f1', fontWeight: 600 }}>Đăng nhập ngay</Link></p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 18, fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', padding: '12px 16px', borderRadius: 8, marginBottom: 18, fontSize: 14 }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Field name="username" label="Username *" placeholder="mai123" />
              <Field name="fullname" label="Họ và tên *" placeholder="Nguyễn Thị Mai" />
            </div>
            <Field name="email" label="Email *" placeholder="user@gmail.com" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Field
                name="pass" label="Mật khẩu *" type="password" placeholder="Tối thiểu 6 ký tự"
                extra={
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {showPass
                        ? <><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029M6.343 6.343A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/></>
                        : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                      }
                    </svg>
                  </button>
                }
              />
              <Field name="confirmPass" label="Xác nhận mật khẩu *" type="password" placeholder="Nhập lại mật khẩu" />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #0284c7)',
                color: '#fff', fontWeight: 700, fontSize: 16, marginTop: 8, transition: '0.3s'
              }}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay →'}
            </button>

            <p style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Bằng cách đăng ký, bạn đồng ý với <span style={{ color: '#6366f1', cursor: 'pointer' }}>Điều khoản dịch vụ</span> và <span style={{ color: '#6366f1', cursor: 'pointer' }}>Chính sách bảo mật</span> của chúng tôi.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
