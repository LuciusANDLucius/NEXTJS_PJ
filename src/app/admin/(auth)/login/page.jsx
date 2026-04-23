'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(credentials);
            if (res && (res.user?.role === 'admin' || res.role === 'admin')) {
                router.push('/admin');
            } else {
                setError('Bạn không có quyền truy cập vào khu vực Admin.');
            }
        } catch (err) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Admin Portal</h1>
                    <p style={{ color: '#64748b' }}>Đăng nhập để quản trị hệ thống</p>
                </div>

                {error && (
                    <div style={{ padding: '12px', borderRadius: '6px', background: '#fee2e2', color: '#dc2626', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Tên đăng nhập</label>
                        <input
                            required
                            type="text"
                            placeholder="admin"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', transition: '0.2s' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Mật khẩu</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', transition: '0.2s' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            background: '#0f172a',
                            color: '#fff',
                            fontWeight: '600',
                            border: 'none',
                            cursor: loading ? 'wait' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: '0.2s',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng nhập Admin'}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <a href="/" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>← Quay lại Cửa hàng</a>
                </div>
            </div>
        </div>
    );
}