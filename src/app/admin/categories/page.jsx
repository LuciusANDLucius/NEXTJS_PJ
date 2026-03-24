'use client';

import React, { useEffect, useState } from 'react';
import { listCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoriesServices';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Search state mock
    const [searchTerm, setSearchTerm] = useState('');

    const loadCategories = async () => {
        try {
            setLoading(true);
            const res = await listCategories();
            // Fallback object struct nếu API bọc `{ data: [] }` hay trả list trực tiếp
            setCategories(res.data || res || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Danh mục:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await deleteCategory(id);
                loadCategories(); 
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleAddClick = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (cat) => {
        setEditingCategory(cat);
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            const id = editingCategory?.cat_id || editingCategory?.id;
            if (id) {
                await updateCategory(id, formData);
            } else {
                await createCategory(formData);
            }
            setIsFormOpen(false);
            loadCategories();
        } catch (error) {
            console.error("Save error:", error);
            alert("Lưu thất bại! Bạn thử kiểm tra lại các trường.");
        }
    };

    const categoryFields = [
        { name: 'cat_name', label: 'Tên danh mục', type: 'text', required: true },
        { name: 'description', label: 'Mô tả', type: 'textarea' }
    ];

    const columns = [
        { key: 'cat_id', label: 'ID Danh mục' },
        { 
            key: 'cat_name', 
            label: 'Tên danh mục',
            render: (row) => <span style={{fontWeight: 600, color: '#0f172a'}}>{row.cat_name || row.name}</span>
        },
        { key: 'description', label: 'Mô tả' },
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
                        onClick={() => handleDelete(row.cat_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Kiểu Danh Mục</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý việc phân loại sản phẩm theo ngành hàng.</p>
                </div>
                <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Thêm Danh mục
                </Button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                     <div style={{ position: 'relative', width: '300px' }}>
                         <svg style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                         <input 
                             type="text" 
                             placeholder="Tìm kiếm danh mục..." 
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#334155' }}
                         />
                     </div>
                </div>

                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu mô phỏng...</div>
                    ) : (
                        <Table columns={columns} data={categories} />
                    )}
                </div>
            </div>

            <AdminaddForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                fields={categoryFields}
                initialData={editingCategory}
                title={editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới"}
            />
        </div>
    );
}
