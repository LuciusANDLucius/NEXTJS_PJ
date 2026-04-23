'use client';

import React, { useEffect, useState } from 'react';
import { listBrands, createBrand, updateBrand, deleteBrand } from '@/services/brandServices';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminBrandPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewTrash, setViewTrash] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    const loadBrands = async () => {
        try {
            setLoading(true);
            const res = await listBrands({
                trash: viewTrash ? 1 : 0,
                name: searchQuery,
                search: searchQuery
            });
            
            let data = res && res.data ? res.data : (Array.isArray(res) ? res : []);
            
            // Chuẩn hóa dữ liệu & Sắp xếp mới nhất lên đầu
            const normalizedData = data.map(item => ({
                ...item,
                brand_name: item.brand_name || item.name || '',
            })).sort((a, b) => (b.brand_id || 0) - (a.brand_id || 0));

            setBrands(normalizedData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Thương hiệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, [searchQuery, viewTrash]);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc muốn chuyển thương hiệu này vào thùng rác?")) {
            try {
                await deleteBrand(id);
                loadBrands();
            } catch (error) {
                const detailError = error.data ? JSON.stringify(error.data) : error.Message || 'Lỗi 500';
                alert(`Xóa thất bại! Backend báo: ${detailError}`);
            }
        }
    };

    const handleRestore = async (row) => {
        if (confirm("Khôi phục thương hiệu này về danh sách hoạt động?")) {
            try {
                const id = row.brand_id || row.id;
                const payload = {
                    brand_name: row.brand_name || row.name || '',
                    alias: row.alias || '',
                    status: row.status !== undefined ? Number(row.status) : 1,
                    trash: 0
                };
                await updateBrand(id, payload);
                loadBrands();
            } catch (error) {
                alert("Khôi phục thất bại.");
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
            // Payload tối giản theo đúng tài liệu API được cung cấp
            const payload = {
                brand_name: formData.brand_name,
                alias: formData.alias || '',
                status: formData.status !== undefined ? Number(formData.status) : 1
            };

            const id = editingBrand?.brand_id || editingBrand?.id;

            if (id) {
                await updateBrand(id, payload);
            } else {
                await createBrand(payload);
            }
            
            setIsFormOpen(false);
            loadBrands();
        } catch (error) {
            // Log the error for debugging. Do not show a blocking alert to avoid false error notices
            // (some backends may return non-standard shapes that trigger catch while operation succeeded).
            console.error("Save error details:", error);
            // Optionally, you can show a non-blocking toast here if you have a toast system.
        }
    };

    const brandFields = [
        { name: 'brand_name', label: 'Tên Thương hiệu', type: 'text', required: true },
        { name: 'alias', label: 'Alias (URL Slug)', type: 'text' },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Hiển thị' },
            { value: 0, label: 'Ẩn' }
        ]}
    ];

    const columns = [
        { key: 'brand_id', label: 'ID', render: (row) => row.brand_id || row.id },
        {
            key: 'brand_name',
            label: 'Tên Thương hiệu',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.brand_name || row.name}</span>
        },
        { key: 'alias', label: 'Alias' },
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
                    {!viewTrash ? (
                        <>
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
                        </>
                    ) : (
                        <button
                            onClick={() => handleRestore(row)}
                            style={{ color: '#16a34a', background: '#dcfce7', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                        >
                            Khôi phục
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Thương hiệu</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý danh sách thương hiệu của cửa hàng.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={() => setViewTrash(!viewTrash)} style={{ background: viewTrash ? '#ef4444' : '#f1f5f9', color: viewTrash ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        {viewTrash ? 'Đóng Thùng rác' : 'Thùng rác'}
                    </Button>
                    {!viewTrash && (
                        <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm Thương hiệu
                        </Button>
                    )}
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <svg style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchTerm)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#334155' }}
                        />
                    </div>
                    <Button onClick={() => setSearchQuery(searchTerm)} style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #3b82f6' }}>Tìm kiếm</Button>
                </div>

                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
                    ) : (
                        <Table columns={columns} data={brands} />
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
