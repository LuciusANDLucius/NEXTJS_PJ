'use client';

import React, { useEffect, useState } from 'react';
import { productAdminService } from '@/services/admin/adminProductService';
import { listCategories } from '@/services/categoriesServices';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Filter state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Để khi bấm Tìm kiếm mới gọi API

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                productAdminService.list({ trash: 0, page: currentPage, name: searchQuery, search: searchQuery, order: 'asc', sort: 'asc' }), // Thử truyền param sort
                listCategories()
            ]);
            let fetchedProducts = prodRes.data || prodRes || [];
            
            // Ép sắp xếp đảo ngược lại (từ thấp đến cao) trên Frontend để đảm bảo logic không bị ngược ID
            fetchedProducts = [...fetchedProducts].sort((a, b) => (a.product_id || 0) - (b.product_id || 0));

            setProducts(fetchedProducts);
            setTotalPages(prodRes.totalPage || prodRes.totalPages || prodRes.last_page || 1);
            
            // Gọi categories 1 lần hoặc song song
            setCategories(catRes.data || catRes || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [currentPage, searchQuery]);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn chuyển sản phẩm này vào thùng rác?")) {
            try {
                await productAdminService.delete(id);
                loadProducts(); 
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = async (id) => {
        try {
            const res = await productAdminService.get(id);
            if (res && res.data) {
                 setEditingProduct(res.data);
            } else {
                 const prod = products.find(p => p.product_id === id);
                 setEditingProduct(prod);
            }
        } catch (e) {
            const prod = products.find(p => p.product_id === id);
            setEditingProduct(prod);
        }
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            // Lọc và ép kiểu dữ liệu chuẩn (tránh gửi string "1" thay vì int 1 vào DB gây lỗi 500)
            const payload = {
                product_name: formData.product_name,
                price: formData.price ? Number(formData.price) : 0,
                image: formData.image || '',
                cat_id: formData.cat_id ? Number(formData.cat_id) : null,
                brand_id: formData.brand_id ? Number(formData.brand_id) : null,
            };

            // Nếu DB có thêm trường, bạn có thể tự thêm vào payload

            if (editingProduct && editingProduct.product_id) {
                await productAdminService.update(editingProduct.product_id, payload);
            } else {
                await productAdminService.create(payload);
            }
            setIsFormOpen(false);
            loadProducts();
        } catch (error) {
            console.error("Save error:", error);
            // In error data từ axios để dễ debug
            const detailError = error.data ? JSON.stringify(error.data) : error.Message || 'Lỗi 500';
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const productFields = [
        { name: 'product_name', label: 'Tên sản phẩm', type: 'text', required: true },
        { name: 'price', label: 'Giá bán', type: 'number', required: true },
        { name: 'image', label: 'Hình ảnh (tên file)', type: 'text' },
        { 
            name: 'cat_id', 
            label: 'Danh mục', 
            type: 'select', 
            required: true, 
            options: categories.map(c => ({ value: c.cat_id || c.id, label: c.cat_name || c.name })) 
        },
        { name: 'brand_id', label: 'ID Thương hiệu', type: 'number' }
    ];

    const columns = [
        { key: 'product_id', label: 'ID' },
        { 
            key: 'image', 
            label: 'Hình ảnh', 
            render: (row) => {
                // Xử lý URL ảnh tự động
                let imgUrl = row.image;
                if (imgUrl && !imgUrl.startsWith('http')) {
                    imgUrl = `http://localhost:5000/uploads/${imgUrl}`;
                }
                return (
                    <img src={imgUrl || 'https://via.placeholder.com/50'} alt="" width="50" height="50" style={{borderRadius: '6px', border: '1px solid #e2e8f0', objectFit: 'cover'}} /> 
                )
            }
        },
        { key: 'product_name', label: 'Tên sản phẩm' },
        { 
            key: 'price', 
            label: 'Giá bán', 
            render: (row) => <span style={{fontWeight: 600, color: '#0f172a'}}>{row.price?.toLocaleString()}đ</span>
        },
        { key: 'cat_name', label: 'Danh mục' },
        {
            key: 'actions',
            label: 'Thao tác',
            render: (row) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                        onClick={() => handleEditClick(row.product_id)}
                        style={{ color: '#0284c7', background: '#e0f2fe', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                    >
                        Sửa
                    </button>
                    <button 
                        onClick={() => handleDelete(row.product_id)}
                        style={{ color: '#dc2626', background: '#fee2e2', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                    >
                        Xóa
                    </button>
                </div>
            )
        }
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Sản phẩm</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý kho hàng, thông tin và giá bán sản phẩm.</p>
                </div>
                <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Thêm Sản phẩm
                </Button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                     <div style={{ position: 'relative', width: '300px' }}>
                         <svg style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                         <input 
                             type="text" 
                             placeholder="Tìm kiếm sản phẩm..." 
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && (setCurrentPage(1), setSearchQuery(searchTerm))}
                             style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#334155' }}
                         />
                     </div>
                     <div style={{ display: 'flex', gap: '12px' }}>
                         <button 
                            onClick={() => { setCurrentPage(1); setSearchQuery(searchTerm); }}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #3b82f6', background: '#e0f2fe', color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                            Lọc & Tìm kiếm
                         </button>
                     </div>
                </div>

                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
                    ) : (
                        <>
                            <Table columns={columns} data={products} />
                            
                            {/* Phân trang */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Trang {currentPage} / {totalPages}</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        disabled={currentPage <= 1} 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: currentPage <= 1 ? '#f8fafc' : '#fff', color: currentPage <= 1 ? '#cbd5e1' : '#475569', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                                    >Trước</button>
                                    
                                    <button 
                                        disabled={currentPage >= totalPages} 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: currentPage >= totalPages ? '#f8fafc' : '#fff', color: currentPage >= totalPages ? '#cbd5e1' : '#475569', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                                    >Sau</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <AdminaddForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                fields={productFields}
                initialData={editingProduct}
                title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
            />
        </div>
    );
}