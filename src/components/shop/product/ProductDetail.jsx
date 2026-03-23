import React from "react";

export default function ProductDetail({product}){
	if(!product) return null;

	return (
		<div className="product-detail">
			<div className="product-media" style={{height:320,background:'#f8fafc',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#334155'}}>Ảnh sản phẩm</div>
			<div className="product-info" style={{marginTop:12}}>
				<h2>{product.product_name || product.title || '—'}</h2>
				<p className="price" style={{fontSize:20,fontWeight:700}}>{product.price ? product.price.toLocaleString() + '₫' : 'Liên hệ'}</p>
				<p><strong>Danh mục:</strong> {product.cat_name || '—'}</p>
				<p><strong>Thương hiệu:</strong> {product.brand_name || '—'}</p>
				<p><strong>Trạng thái:</strong> {product.status === 1 ? 'Hiển thị' : 'Ẩn'}</p>
				<div style={{marginTop:12}}>
					<button className="btn">Thêm vào giỏ</button>
				</div>
			</div>
		</div>
	)
}
