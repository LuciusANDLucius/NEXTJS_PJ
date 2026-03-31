'use client';

import React, { useEffect, useState } from 'react';
import { listBrands, createBrand, updateBrand, deleteBrand } from '@/services/brandServices';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminBrandPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadBrands = async () => {
        try {
            setLoading(true);
            const res = await listBrands();
            setBrands(res.data || res || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Thương hiệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
            try {
                await deleteBrand(id);
                loadBrands();
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleAddClick = () => {
        setEditingBrand(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (brand) => {
        setEditingBrand(brand);
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            const id = editingBrand?.brand_id || editingBrand?.id;
            const payload = {
                brand_name: formData.brand_name || formData.name || '',
                slug: formData.slug || '',
                description: formData.description || '',
                status: formData.status ?? 1,
            };
            if (id) {
                await updateBrand(id, payload);
            } else {
                await createBrand(payload);
            }
            setIsFormOpen(false);
            loadBrands();
        } catch (error) {
            console.error("Save error:", error);
            const detailError = error.data ? JSON.stringify(error.data) : error.message || 'Lỗi 500';
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const brandFields = [
        { name: 'brand_name', label: 'Tên Thương hiệu', type: 'text', required: true },
        { name: 'slug', label: 'Slug (URL)', type: 'text' },
        { name: 'description', label: 'Mô tả', type: 'textarea' },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Hiển thị' },
            { value: 0, label: 'Ẩn' }
        ]},
    ];

    const filteredBrands = brands.filter(b => {
        const term = searchTerm.toLowerCase();
        return (b.brand_name || b.name || '').toLowerCase().includes(term);
    });

    const columns = [
        { key: 'brand_id', label: 'ID', render: (row) => row.brand_id || row.id },
        {
            key: 'brand_name',
            label: 'Tên Thương hiệu',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.brand_name || row.name}</span>
        },
        { key: 'slug', label: 'Slug' },
        { key: 'description', label: 'Mô tả' },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row) => {
                const active = Number(row.status) === 1;
                return <span style={{ padding: '4px 12px', borderRadius: '20px', background: active ? '#dcfce7' : '#fee2e2', color: active ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '13px' }}>{active ? 'Hiển thị' : 'Ẩn'}</span>;
            }
        },
        {
            key: 'actions',
            label: 'Thao tác',
            render: (row) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                        onClick={() => handleEditClick(row)}
                        style={{ color: '#0284c7', background: '#e0f2fe', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                    >
                        Sửa
                    </button>
                    <button
                        onClick={() => handleDelete(row.brand_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Thương hiệu</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý danh sách thương hiệu sản phẩm trên website.</p>
                </div>
                <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Thêm Thương hiệu
                </Button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <svg style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm thương hiệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#334155' }}
                        />
                    </div>
                </div>

                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
                    ) : (
                        <Table columns={columns} data={filteredBrands} />
                    )}
                </div>
            </div>

            <AdminaddForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                fields={brandFields}
                initialData={editingBrand}
                title={editingBrand ? "Chỉnh sửa Thương hiệu" : "Thêm Thương hiệu Mới"}
            />
        </div>
    );
}
