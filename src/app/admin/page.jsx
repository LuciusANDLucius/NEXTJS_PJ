'use client';

import React from 'react';

export default function AdminDashboardPage() {
    return (
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 136px)' }}>
            <div style={{ textAlign: 'center', background: '#fff', padding: '60px 100px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <svg width="64" height="64" style={{ color: '#3b82f6', marginBottom: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 style={{ margin: '0 0 16px', fontSize: '32px', color: '#0f172a' }}>Chào mừng đến Bảng điều khiển!</h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '18px' }}>
                    Sử dụng thanh thanh điều hướng bên trái để quản lý cửa hàng của bạn.
                </p>
            </div>
        </div>
    );
}