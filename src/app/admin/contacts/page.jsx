'use client';

import React, { useEffect, useState } from 'react';
import { listContacts, deleteContact } from '@/services/contactService';
import Table from '@/components/common/Table';

export default function AdminContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const res = await listContacts();
            let items = res.data || res || [];
            // Mới nhất lên đầu
            items = [...items].sort((a, b) => (b.contact_id || b.id || 0) - (a.contact_id || a.id || 0));
            setContacts(items);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Liên hệ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) {
            try {
                await deleteContact(id);
                loadContacts();
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const filteredContacts = contacts.filter(c => {
        const term = searchTerm.toLowerCase();
        return (c.fullname || c.name || '').toLowerCase().includes(term)
            || (c.email || '').toLowerCase().includes(term)
            || (c.title || c.subject || '').toLowerCase().includes(term);
    });

    const columns = [
        { key: 'contact_id', label: 'ID', render: (row) => row.contact_id || row.id },
        {
            key: 'fullname',
            label: 'Người gửi',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.fullname || row.name || '—'}</span>
        },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'SĐT' },
        {
            key: 'title',
            label: 'Tiêu đề',
            render: (row) => <span style={{ maxWidth: '200px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.title || row.subject || '—'}</span>
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row) => {
                const read = Number(row.status) === 1;
                return <span style={{ padding: '4px 12px', borderRadius: '20px', background: read ? '#dcfce7' : '#fef3c7', color: read ? '#16a34a' : '#f59e0b', fontWeight: 600, fontSize: '13px' }}>{read ? 'Đã đọc' : 'Chưa đọc'}</span>;
            }
        },
        {
            key: 'actions',
            label: 'Thao tác',
            render: (row) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                        onClick={() => setSelectedContact(row)}
                        style={{ color: '#0284c7', background: '#e0f2fe', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                    >
                        Xem
                    </button>
                    <button
                        onClick={() => handleDelete(row.contact_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Liên hệ</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Xem và quản lý tin nhắn liên hệ từ khách hàng.</p>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <svg style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm liên hệ..."
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
                        <Table columns={columns} data={filteredContacts} />
                    )}
                </div>
            </div>

            {/* Modal xem chi tiết liên hệ */}
            {selectedContact && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', width: '550px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Chi tiết Liên hệ</h3>
                            <button onClick={() => setSelectedContact(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#94a3b8', lineHeight: 1 }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Người gửi</div>
                                <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 600 }}>{selectedContact.fullname || selectedContact.name || '—'}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                                    <div style={{ fontSize: '15px', color: '#334155' }}>{selectedContact.email || '—'}</div>
                                </div>
                                <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Số điện thoại</div>
                                    <div style={{ fontSize: '15px', color: '#334155' }}>{selectedContact.phone || '—'}</div>
                                </div>
                            </div>
                            <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Tiêu đề</div>
                                <div style={{ fontSize: '15px', color: '#334155' }}>{selectedContact.title || selectedContact.subject || '—'}</div>
                            </div>
                            <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>Nội dung</div>
                                <div style={{ fontSize: '15px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedContact.content || selectedContact.message || '—'}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', textAlign: 'right' }}>
                            <button onClick={() => setSelectedContact(null)} style={{ padding: '10px 24px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
