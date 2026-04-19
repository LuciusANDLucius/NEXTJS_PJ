'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listProducts } from '@/services/productService';
import { listOrders } from '@/services/orderServices';
import { listCategories } from '@/services/categoriesServices';
import { listUsers } from '@/services/userService';
import { listPosts } from '@/services/postService';

const StatCard = ({ label, value, icon, color, href }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#fff', borderRadius: 12, padding: '24px 28px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex',
      alignItems: 'center', gap: 20, cursor: 'pointer', transition: '0.2s',
      borderLeft: `4px solid ${color}`
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
    >
      <div style={{ width: 52, height: 52, borderRadius: 12, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value ?? '...'}</div>
        <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  </Link>
);

const QuickAction = ({ href, icon, label, color }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#fff', borderRadius: 10, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.2s',
      border: '1px solid #f1f5f9'
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.transform = 'none'; }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{label}</span>
    </div>
  </Link>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: null, orders: null, categories: null, users: null, posts: null });

  useEffect(() => {
    const load = async () => {
      const results = await Promise.allSettled([
        listProducts({ limit: 1 }),
        listOrders(),
        listCategories(),
        listUsers(),
        listPosts(),
      ]);

      const [products, orders, categories, users, posts] = results.map(r => r.status === 'fulfilled' ? r.value : null);

      setStats({
        products: products?.totalItems ?? (products?.data?.length) ?? (Array.isArray(products) ? products.length : '—'),
        orders: orders?.data?.length ?? (Array.isArray(orders) ? orders.length : '—'),
        categories: (Array.isArray(categories) ? categories.length : categories?.data?.length) ?? '—',
        users: (Array.isArray(users) ? users.length : users?.data?.length) ?? '—',
        posts: (Array.isArray(posts) ? posts.length : posts?.data?.length) ?? '—',
      });
    };
    load();
  }, []);

  const quickActions = [
    { href: '/admin/products', icon: '📦', label: 'Thêm sản phẩm', color: '#3b82f6' },
    { href: '/admin/posts', icon: '✏️', label: 'Viết bài mới', color: '#10b981' },
    { href: '/admin/orders', icon: '🛒', label: 'Xem đơn hàng', color: '#f59e0b' },
    { href: '/admin/banners', icon: '🖼️', label: 'Quản lý banner', color: '#6366f1' },
    { href: '/admin/categories', icon: '📁', label: 'Quản lý danh mục', color: '#ec4899' },
    { href: '/admin/users', icon: '👤', label: 'Quản lý người dùng', color: '#0284c7' },
    { href: '/admin/contacts', icon: '✉️', label: 'Xem liên hệ', color: '#64748b' },
    { href: '/', icon: '🏠', label: 'Xem trang khách hàng', color: '#94a3b8' },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Page Title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>Bảng điều khiển</h1>
        <p style={{ color: '#64748b', marginTop: 6, fontSize: 15 }}>Tổng quan hệ thống quản trị ShopAZ</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard label="Sản phẩm" value={stats.products} icon="📦" color="#3b82f6" href="/admin/products" />
        <StatCard label="Đơn hàng" value={stats.orders} icon="🛒" color="#f59e0b" href="/admin/orders" />
        <StatCard label="Danh mục" value={stats.categories} icon="📁" color="#ec4899" href="/admin/categories" />
        <StatCard label="Người dùng" value={stats.users} icon="👤" color="#0284c7" href="/admin/users" />
        <StatCard label="Bài viết" value={stats.posts} icon="✏️" color="#10b981" href="/admin/posts" />
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 20, marginTop: 0 }}>
          ⚡ Truy cập nhanh
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {quickActions.map(a => <QuickAction key={a.href} {...a} />)}
        </div>
      </div>

      {/* Help Note */}
      <div style={{ marginTop: 24, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div>
          <div style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: 4 }}>Lưu ý dành cho Admin</div>
          <div style={{ fontSize: 14, color: '#3b82f6', lineHeight: 1.6 }}>
            Để truy cập Admin, tài khoản cần có <code style={{ background: '#dbeafe', padding: '1px 6px', borderRadius: 4 }}>user_type = "admin"</code> trong database. 
            Nếu đang phát triển, hãy cập nhật thủ công trong DB hoặc qua API <code style={{ background: '#dbeafe', padding: '1px 6px', borderRadius: 4 }}>PUT /api/users/:id</code>.
          </div>
        </div>
      </div>
    </div>
  );
}