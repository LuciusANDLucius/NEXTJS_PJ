import React from 'react'
import ProductCard from './ProductCard'
import Empty from '@/components/common/Empty'

export default function ProductList({items}){
  if(!items || items.length === 0) return <Empty message="Chưa có sản phẩm" />

  return (
    <div className="product-grid">
      {items.map(i => <ProductCard key={i.id} product={i} />)}
    </div>
  )
}
