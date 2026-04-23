'use client';

import React, { useEffect, useState } from 'react';
import { listPages, createPage, updatePage, deletePage } from '@/services/pageService';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminPageManagement() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewTrash, setViewTrash] = useState(false);

    const loadPages = async () => {
        try {
            setLoading(true);
            const res = await listPages({ trash: viewTrash ? 1 : 0 });
            setPages(res.data || res || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Trang:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, [viewTrash]);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn chuyển trang này vào thùng rác?")) {
            try {
                await deletePage(id);
                loadPages();
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleRestore = async (row) => {
        if (confirm("Khôi phục trang này về danh sách hoạt động?")) {
            try {
                const id = row.page_id || row.id;
                const payload = {
                    title: row.title || '',
                    content: row.content || '',
                    status: 1,
                    trash: 0
                };
                await updatePage(id, payload);
                loadPages();
            } catch (error) {
                alert("Khôi phục thất bại!");
            }
        }
    };

    const handleAddClick = () => {
        setEditingPage(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (page) => {
        setEditingPage(page);
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            const id = editingPage?.page_id || editingPage?.id;
            const payload = {
                title: formData.title || '',
                content: formData.content || '',
                status: formData.status ?? 1,
            };
            if (id) {
                await updatePage(id, payload);
            } else {
                await createPage(payload);
            }
            setIsFormOpen(false);
            loadPages();
        } catch (error) {
            console.error("Save error:", error);
            const detailError = error.data ? JSON.stringify(error.data) : error.message || 'Lỗi 500';
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const pageFields = [
        { name: 'title', label: 'Tiêu đề Trang', type: 'text', required: true },
        { name: 'content', label: 'Nội dung', type: 'textarea' },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Hiển thị' },
            { value: 0, label: 'Ẩn' }
        ]},
    ];

    const filteredPages = pages.filter(p => {
        const term = searchTerm.toLowerCase();
        return (p.title || '').toLowerCase().includes(term) || (p.slug || '').toLowerCase().includes(term);
    });

    const columns = [
        { key: 'page_id', label: 'ID', render: (row) => row.page_id || row.id },
        {
            key: 'title',
            label: 'Tiêu đề',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.title}</span>
        },
        { key: 'slug', label: 'Slug' },
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
                                onClick={() => handleDelete(row.page_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Trang</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý nội dung các trang tĩnh (Giới thiệu, Chính sách, ...).</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={() => setViewTrash(!viewTrash)} style={{ background: viewTrash ? '#ef4444' : '#f1f5f9', color: viewTrash ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        {viewTrash ? 'Đóng Thùng rác' : 'Thùng rác'}
                    </Button>
                    {!viewTrash && (
                        <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm Trang
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
                            placeholder="Tìm kiếm trang..."
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
                        <Table columns={columns} data={filteredPages} />
                    )}
                </div>
            </div>

            <AdminaddForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                fields={pageFields}
                initialData={editingPage}
                title={editingPage ? "Chỉnh sửa Trang" : "Thêm Trang Mới"}
            />
        </div>
    );
}
