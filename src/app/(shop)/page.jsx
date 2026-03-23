import React from 'react'
import Menu from '@/components/shop/Menu'
import ProductList from '@/components/shop/product/ProductList'
import FeaturedProducts from '@/components/shop/FeaturedProducts'

export default function ShopPage() {
  // No demo products: page shows empty state until real data is provided
  const products = []

  return (
    <div className="container">
      <section className="hero">
        <h1>Mua sắm phong cách — Chất lượng Việt</h1>
        <p>Chọn những sản phẩm thiết kế đẹp, giao hàng nhanh chóng.</p>
      </section>

      <div className="layout" style={{marginTop:20}}>
        <Menu />
        <div className="content">
          <FeaturedProducts limit={6} />
        </div>
      </div>
    </div>
  )
}

