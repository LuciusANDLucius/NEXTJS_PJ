import React from 'react'

export default function ProductCard({product}){
  return (
    <article className="product-card">
      <div style={{height:160,background:'#eef2ff',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#334155'}}>Ảnh</div>
      <div className="title">{product.title}</div>
      <div className="price">{product.price}</div>
      <div style={{marginTop:'auto'}}>
        <button className="btn">Thêm vào giỏ</button>
      </div>
    </article>
  )
}
