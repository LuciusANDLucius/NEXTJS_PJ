'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from '../(others)/cart/cart.module.css';

export default function CheckoutPage() {
  const { cart, total, totalItems, clearCart } = useCart();
  const [ordered, setOrdered] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    address: '',
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Fake API request 
    setTimeout(() => {
      clearCart();
      setOrdered(true);
    }, 800);
  };

  if (ordered) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <svg style={{ color: '#10b981', margin: '0 auto 20px' }} width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Đặt hàng thành công!</h1>
        <p style={{ color: '#475569', marginBottom: 30, fontSize: 16 }}>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn sẽ sớm được xử lý và giao đến tận nơi.</p>
        <Link href="/" className="btn btn-lg" style={{ display: 'inline-flex', padding: '12px 30px' }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Giỏ hàng bạn trống, không thể thanh toán.</h2>
        <Link href="/products" className="btn btn-lg">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30, color: '#0f172a' }}>Thanh toán đơn hàng</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 40, alignItems: 'start' }}>
        {/* Checkout Form */}
        <div style={{ background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>Họ và tên *</label>
              <input required type="text" placeholder="Nhập họ và tên..." value={formData.fullname} onChange={e => setFormData({...formData, fullname: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>Số điện thoại *</label>
              <input required type="tel" placeholder="Nhập số điện thoại..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>Địa chỉ nhận hàng *</label>
              <textarea required placeholder="Nhập địa chỉ chi tiết (số nhà, ngõ, đường, quận/huyện...)" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#334155' }}>Ghi chú đơn hàng (Tùy chọn)</label>
              <textarea placeholder="Lưu ý cho người giao hàng..." rows={2} value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn btn-lg" style={{ marginTop: 10, width: '100%', padding: '16px', fontSize: 16 }}>
              Hoàn tất đặt hàng
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ background: '#f8fafc', padding: 30, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 20, marginBottom: 24, borderBottom: '1px solid #cbd5e1', paddingBottom: 12 }}>Tóm tắt đơn hàng ({totalItems} sp)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, maxHeight: 400, overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.product_id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <img src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`) : '/placeholder.jpg'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 14, color: '#334155', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.product_name || item.name}</h4>
                  <div style={{ fontSize: 13, color: '#64748b' }}>SL: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>
                  {((Number(item.sale_price) || Number(item.price) || 0) * item.quantity).toLocaleString('vi-VN')} đ
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 15 }}>
              <span>Tạm tính</span>
              <span style={{ fontWeight: 500 }}>{total.toLocaleString('vi-VN')} đ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 15 }}>
              <span>Phí vận chuyển</span>
              <span style={{ fontWeight: 500 }}>Miễn phí</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f172a', fontSize: 20, fontWeight: 700, marginTop: 12, borderTop: '1px solid #cbd5e1', paddingTop: 20 }}>
              <span>Tổng cộng</span>
              <span style={{ color: '#dc2626' }}>{total.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
