import React from 'react'

export default function Menu(){
  const categories = ['Áo thun','Quần','Giày','Phụ kiện','Túi xách','Áo khoác']
  return (
    <aside className="sidebar">
      <h4>Danh mục</h4>
      <ul className="menu-list">
        {categories.map(c => <li key={c}>{c}</li>)}
      </ul>
    </aside>
  )
}
