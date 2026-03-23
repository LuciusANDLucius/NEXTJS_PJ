import React from 'react'
import Link from 'next/link'

export default function ProductCard({product}){
  const id = product.product_id || product.id || product.productId
  const title = product.product_name || product.title || 'Sản phẩm'
  const price = product.price ? Number(product.price).toLocaleString() + '₫' : 'Liên hệ'

  return (
    <article className="product-card">
      <Link href={`/products/${id}`} style={{textDecoration:'none',color:'inherit'}}>
        <div>
          <div style={{height:160,background:'#eef2ff',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#334155'}}>Ảnh</div>
          <div className="title">{title}</div>
          <div className="price">{price}</div>
        </div>
      </Link>
      <div style={{marginTop:'auto'}}>
        <button className="btn">Thêm vào giỏ</button>
      </div>
    </article>
  )
}
