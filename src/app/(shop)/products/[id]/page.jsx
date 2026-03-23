"use client"
import React, {useEffect, useState} from 'react'
import { useParams } from 'next/navigation'
import { getProduct } from '@/services/productService'
import ProductDetail from '@/components/shop/product/ProductDetail'

export default function ProductDetailPage(){
  const params = useParams()
  const id = params?.id
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(!id) return
    setLoading(true)
    getProduct(id).then(p=> setProduct(p)).catch(e=> console.error(e)).finally(()=>setLoading(false))
  },[id])

  if(loading) return <div>Đang tải...</div>
  if(!product) return <div>Không tìm thấy sản phẩm</div>

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  )
}
