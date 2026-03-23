import React from 'react';

export default function Sidebar() {
  return (
    <aside style={{ 
      width: '200px', 
      height: '100vh', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      padding: '20px' 
    }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>Admin Panel</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #334155', cursor: 'pointer' }}>Dashboard</li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #334155', cursor: 'pointer' }}>Quản lý Sản phẩm</li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #334155', cursor: 'pointer' }}>Đơn hàng</li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #334155', cursor: 'pointer' }}>Cài đặt</li>
      </ul>
    </aside>
  );
}