"use client"
import React, {useEffect, useState} from 'react'
import ProductList from '@/components/shop/product/ProductList'
import { listProducts } from '@/services/productService'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function ProductsPage(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [q, setQ] = useState('')

  const fetch = async () => {
    setLoading(true)
    try{
      const res = await listProducts({ page, limit, name: q })
      // backend response shape: { currentPage, totalPage, data }
      setItems(res.data || [])
      setTotalPages(res.totalPage || 1)
    }catch(e){
      console.error('fetch products', e)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ fetch() }, [page])

  const onSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetch()
  }

  return (
    <div>
      <h2>Sản phẩm</h2>

      <form onSubmit={onSearch} style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Tìm theo tên" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" type="submit">Tìm</button>
      </form>

      {loading ? <div>Đang tải...</div> : <ProductList items={items} />}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}>
        <button className="btn" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Trang trước</button>
        <div>Trang {page} / {totalPages}</div>
        <button className="btn" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Trang sau</button>
      </div>
    </div>
  )
}
 
