"use client"
import React, { useEffect, useState } from 'react'
import ProductList from '@/components/shop/product/ProductList'
import { listProducts } from '@/services/productService'

export default function FeaturedProducts({ limit = 6 }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetch(){
      try{
        const res = await listProducts({ limit })
        // handle wrapper response
        const data = res?.data || (Array.isArray(res) ? res : [])
        if(mounted) setItems(data)
      }catch(err){
        console.error('featured products', err)
        if(mounted) setError('Không thể tải sản phẩm')
      }finally{ if(mounted) setLoading(false) }
    }
    fetch()
    return () => { mounted = false }
  }, [limit])

  if(loading) return <div>Đang tải sản phẩm...</div>
  if(error) return <div style={{color:'crimson'}}>{error}</div>
  if(!items || items.length === 0) return <div>Chưa có sản phẩm</div>

  return <ProductList items={items} />
}
