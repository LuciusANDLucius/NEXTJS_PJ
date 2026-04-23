'use client';

import React, { useEffect, useState } from 'react';
import { listCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoriesServices';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]); // Để dùng cho dropdown Danh mục cha
    const [loading, setLoading] = useState(true);
    const [viewTrash, setViewTrash] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const loadCategories = async () => {
        try {
            setLoading(true);
            // Lấy danh sách theo view (Active hoặc Trash)
            const res = await listCategories({ 
                trash: viewTrash ? 1 : 0,
                name: searchQuery,
                search: searchQuery
            });
            const data = res.data || res || [];
            
            // Chuẩn hóa & Sắp xếp mới nhất lên đầu
            const normalizedData = data.map(item => ({
                ...item,
                cat_name: item.cat_name || item.name || '',
            })).sort((a, b) => (b.cat_id || 0) - (a.cat_id || 0));
            
            setCategories(normalizedData);

            // Lấy thêm danh sách Active để làm dropdown Danh mục cha
            if (!viewTrash) {
                setAllCategories(normalizedData);
            } else {
                const activeRes = await listCategories({ trash: 0 });
                const activeData = activeRes.data || activeRes || [];
                setAllCategories(activeData.map(item => ({
                    ...item,
                    cat_name: item.cat_name || item.name || '',
                })));
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Danh mục:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [searchQuery, viewTrash]);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn chuyển danh mục này vào thùng rác?")) {
            try {
                await deleteCategory(id);
                loadCategories(); 
            } catch (error) {
                const detailError = error.data ? JSON.stringify(error.data) : error.Message || 'Lỗi 500';
                alert(`Xóa thất bại! Backend báo: ${detailError}`);
            }
        }
    };

    const handleRestore = async (row) => {
        if (confirm("Khôi phục danh mục này về danh sách hoạt động?")) {
            try {
                const id = row.cat_id || row.id;
                const payload = {
                    cat_name: row.cat_name || row.name || '',
                    alias: row.alias || '',
                    parent_id: row.parent_id || 0,
                    status: row.status !== undefined ? Number(row.status) : 1,
                    trash: 0
                };
                await updateCategory(id, payload);
                loadCategories();
            } catch (error) {
                alert("Khôi phục thất bại!");
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
            
            // Payload chuẩn theo API Doc (POST/PUT)
            const payload = {
                cat_name: formData.cat_name,
                alias: formData.alias || '',
                parent_id: formData.parent_id ? Number(formData.parent_id) : 0,
                status: formData.status !== undefined ? Number(formData.status) : 1,
            };

            if (id) {
                await updateCategory(id, payload);
            } else {
                await createCategory(payload);
            }
            setIsFormOpen(false);
            loadCategories();
        } catch (error) {
            console.error("Save error details:", error);
            const detailError = error.data ? JSON.stringify(error.data) : error.Message || 'Lỗi hệ thống';
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const categoryFields = [
        { name: 'cat_name', label: 'Tên danh mục', type: 'text', required: true },
        { name: 'alias', label: 'Alias (URL Slug)', type: 'text' },
        { 
            name: 'parent_id', 
            label: 'Danh mục cha', 
            type: 'select',
            options: [
                { value: 0, label: 'Gốc (Không có cha)' },
                ...allCategories.filter(c => (c.cat_id || c.id) !== (editingCategory?.cat_id || editingCategory?.id))
                    .map(c => ({ value: c.cat_id || c.id, label: c.cat_name || c.name }))
            ]
        },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Hiển thị' },
            { value: 0, label: 'Ẩn' }
        ]},
    ];

    const columns = [
        { key: 'cat_id', label: 'ID', render: (row) => row.cat_id || row.id },
        { 
            key: 'cat_name', 
            label: 'Tên danh mục',
            render: (row) => <span style={{fontWeight: 600, color: '#0f172a'}}>{row.cat_name || row.name}</span>
        },
        { key: 'alias', label: 'Alias' },
        { 
            key: 'parent_id', 
            label: 'Danh mục cha',
            render: (row) => {
                if (Number(row.parent_id) === 0) return <span style={{color: '#94a3b8'}}>Gốc</span>;
                const parent = allCategories.find(c => (c.cat_id || c.id) === Number(row.parent_id));
                return parent ? parent.cat_name || parent.name : `ID: ${row.parent_id}`;
            }
        },
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
                                onClick={() => handleDelete(row.cat_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Danh mục</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý phân cấp danh mục sản phẩm (Ngành hàng).</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={() => setViewTrash(!viewTrash)} style={{ background: viewTrash ? '#ef4444' : '#f1f5f9', color: viewTrash ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        {viewTrash ? 'Đóng Thùng rác' : 'Thùng rác'}
                    </Button>
                    {!viewTrash && (
                        <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm Danh mục
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
