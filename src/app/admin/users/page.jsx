'use client';

import React, { useEffect, useState } from 'react';
import { listUsers, createUser, updateUser, deleteUser } from '@/services/userService';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await listUsers();
            setUsers(res.data || res || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                await deleteUser(id);
                loadUsers();
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleAddClick = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            const id = editingUser?.user_id || editingUser?.id;
            const payload = {
                fullname: formData.fullname || '',
                email: formData.email || '',
                phone: formData.phone || '',
                user_type: formData.user_type || 'customer',
                address: formData.address || '',
                status: formData.status ?? 1,
            };
            // Chỉ gửi password khi tạo mới hoặc user nhập
            if (formData.password) {
                payload.password = formData.password;
            }
            if (id) {
                await updateUser(id, payload);
            } else {
                await createUser(payload);
            }
            setIsFormOpen(false);
            loadUsers();
        } catch (error) {
            console.error("Save error:", error);
            const detailError = error.data ? JSON.stringify(error.data) : error.message || 'Lỗi 500';
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const userFields = [
        { name: 'fullname', label: 'Họ và tên', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'phone', label: 'Số điện thoại', type: 'text' },
        { name: 'password', label: 'Mật khẩu (để trống nếu không đổi)', type: 'text' },
        { name: 'user_type', label: 'Loại tài khoản', type: 'select', options: [
            { value: 'customer', label: 'Khách hàng' },
            { value: 'admin', label: 'Admin' },
        ]},
        { name: 'address', label: 'Địa chỉ', type: 'textarea' },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Kích hoạt' },
            { value: 0, label: 'Khóa' }
        ]},
    ];

    const filteredUsers = users.filter(u => {
        const term = searchTerm.toLowerCase();
        return (u.fullname || u.name || '').toLowerCase().includes(term)
            || (u.email || '').toLowerCase().includes(term)
            || (u.phone || '').toLowerCase().includes(term);
    });

    const columns = [
        { key: 'user_id', label: 'ID', render: (row) => row.user_id || row.id },
        {
            key: 'fullname',
            label: 'Họ và tên',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.fullname || row.name}</span>
        },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'SĐT' },
        {
            key: 'user_type',
            label: 'Loại',
            render: (row) => {
                const isAdmin = (row.user_type || '').toLowerCase() === 'admin';
                return <span style={{ padding: '4px 12px', borderRadius: '20px', background: isAdmin ? '#ede9fe' : '#e0f2fe', color: isAdmin ? '#7c3aed' : '#0284c7', fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>{row.user_type || 'customer'}</span>;
            }
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row) => {
                const active = Number(row.status) === 1;
                return <span style={{ padding: '4px 12px', borderRadius: '20px', background: active ? '#dcfce7' : '#fee2e2', color: active ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '13px' }}>{active ? 'Kích hoạt' : 'Khóa'}</span>;
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
                        onClick={() => handleDelete(row.user_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Người dùng</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý tài khoản người dùng và phân quyền hệ thống.</p>
                </div>
                <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Thêm Người dùng
                </Button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <svg style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
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
                        <Table columns={columns} data={filteredUsers} />
                    )}
                </div>
            </div>

            <AdminaddForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                fields={userFields}
                initialData={editingUser}
                title={editingUser ? "Chỉnh sửa Người dùng" : "Thêm Người dùng Mới"}
            />
        </div>
    );
}
