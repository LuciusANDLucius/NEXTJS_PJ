import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 920, margin: '48px auto', padding: 28 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 36, boxShadow: '0 6px 24px rgba(15,23,42,0.06)' }}>
        <h1 style={{ fontSize: 32, marginBottom: 12, color: '#0f172a' }}>Về ShopAZ</h1>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>ShopAZ là cửa hàng trực tuyến dành cho những người mua sắm thông minh — chúng tôi cung cấp sản phẩm chất lượng, giao hàng nhanh và dịch vụ chăm sóc khách hàng tận tâm.</p>

        <h2 style={{ fontSize: 20, marginTop: 8, marginBottom: 8 }}>Sứ mệnh</h2>
        <p style={{ color: '#475569', marginBottom: 16 }}>Mang đến trải nghiệm mua sắm tiện lợi và đáng tin cậy cho mọi nhà, với sản phẩm được chọn lọc và mức giá hợp lý.</p>

        <h2 style={{ fontSize: 20, marginTop: 8, marginBottom: 8 }}>Những gì chúng tôi cung cấp</h2>
        <ul style={{ color: '#475569', marginLeft: 20, marginBottom: 18 }}>
          <li>Danh mục sản phẩm đa dạng: đồ điện tử, thời trang, gia dụng và nhiều hơn nữa.</li>
          <li>Giao hàng nhanh, chế độ đổi trả rõ ràng.</li>
          <li>Hỗ trợ khách hàng thân thiện, an toàn khi thanh toán.</li>
        </ul>

        <p style={{ color: '#475569' }}>Bạn cần hỗ trợ hoặc muốn hợp tác cùng chúng tôi? Vui lòng truy cập trang <Link href="/contact" style={{ color: '#6366f1' }}>Liên hệ</Link> để gửi yêu cầu.</p>

        <div style={{ marginTop: 22 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#3b82f6', color: 'white', padding: '10px 18px', borderRadius: 8, border: 'none', fontWeight: 600 }}>Quay về trang chủ</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
