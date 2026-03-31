'use client';

import React, { useEffect, useState } from 'react';
import { listLinks, createLink, updateLink, deleteLink } from '@/services/linkService';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminLinkPage() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadLinks = async () => {
        try {
            setLoading(true);
            const res = await listLinks();
            setLinks(res.data || res || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Liên kết:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa liên kết này?")) {
            try {
                await deleteLink(id);
                loadLinks();
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleAddClick = () => {
        setEditingLink(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (link) => {
        setEditingLink(link);
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            const id = editingLink?.link_id || editingLink?.id;
            const payload = {
                title: formData.title || '',
                link: formData.link || '',
                image: formData.image || '',
                position: formData.position || 'navbar',
                display_order: Number(formData.display_order) || 0,
                status: Number(formData.status) ?? 1,
            };
            if (id) {
                await updateLink(id, payload);
            } else {
                await createLink(payload);
            }
            setIsFormOpen(false);
            loadLinks();
        } catch (error) {
            console.error("Save error:", error);
            const detailError = error.data ? JSON.stringify(error.data) : error.message || 'Lỗi 500';
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const linkFields = [
        { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
        { name: 'link', label: 'Đường dẫn (URL)', type: 'text', required: true },
        { name: 'image', label: 'Hình ảnh (tên file hoặc URL)', type: 'text' },
        { name: 'position', label: 'Vị trí', type: 'select', required: true, options: [
            { value: 'navbar', label: 'Navbar' },
            { value: 'footer', label: 'Footer' },
        ]},
        { name: 'display_order', label: 'Thứ tự hiển thị', type: 'number' },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Hiển thị' },
            { value: 0, label: 'Ẩn' }
        ]},
    ];

    const filteredLinks = links.filter(l => {
        const term = searchTerm.toLowerCase();
        return (l.title || '').toLowerCase().includes(term) || (l.link || '').toLowerCase().includes(term);
    });

    const columns = [
        { key: 'link_id', label: 'ID', render: (row) => row.link_id || row.id },
        {
            key: 'title',
            label: 'Tiêu đề',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.title}</span>
        },
        {
            key: 'link',
            label: 'Đường dẫn',
            render: (row) => (
                <a href={row.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', maxWidth: '220px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.link || '—'}
                </a>
            )
        },
        {
            key: 'image',
            label: 'Hình ảnh',
            render: (row) => row.image ? (
                <span style={{ color: '#334155', fontSize: '13px' }}>{row.image}</span>
            ) : <span style={{ color: '#94a3b8' }}>NULL</span>
        },
        {
            key: 'position',
            label: 'Vị trí',
            render: (row) => {
                const isNavbar = (row.position || '').toLowerCase() === 'navbar';
                return <span style={{ padding: '4px 10px', borderRadius: '20px', background: isNavbar ? '#e0f2fe' : '#ede9fe', color: isNavbar ? '#0284c7' : '#7c3aed', fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>{row.position || '—'}</span>;
            }
        },
        { key: 'display_order', label: 'Thứ tự', render: (row) => row.display_order ?? 0 },
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
                        onClick={() => handleDelete(row.link_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Liên kết</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý menu navbar và footer trên website.</p>
                </div>
                <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Thêm Liên kết
                </Button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <svg style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm liên kết..."
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
                        <Table columns={columns} data={filteredLinks} />
                    )}
                </div>
            </div>

            <AdminaddForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                fields={linkFields}
                initialData={editingLink}
                title={editingLink ? "Chỉnh sửa Liên kết" : "Thêm Liên kết Mới"}
            />
        </div>
    );
}
