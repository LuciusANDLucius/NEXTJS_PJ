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
    const [searchQuery, setSearchQuery] = useState('');
    const [viewTrash, setViewTrash] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await listUsers({ 
                trash: viewTrash ? 1 : 0,
                name: searchQuery,
                search: searchQuery 
            });
            const data = res.data || res || [];
            
            // Sắp xếp mới nhất lên đầu
            const sortedData = [...data].sort((a, b) => (b.user_id || b.id || 0) - (a.user_id || a.id || 0));
            setUsers(sortedData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [viewTrash, searchQuery]);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn chuyển người dùng này vào thùng rác?")) {
            try {
                await deleteUser(id);
                loadUsers();
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleRestore = async (row) => {
        if (confirm("Khôi phục người dùng này về danh sách hoạt động?")) {
            try {
                const id = row.user_id || row.id;
                // Payload tối thiểu theo API Doc
                const payload = {
                    username: row.username,
                    email: row.email,
                    fullname: row.fullname || row.name,
                    role: row.role || 'customer',
                    status: 1
                };
                await updateUser(id, payload);
                loadUsers();
            } catch (error) {
                alert("Khôi phục thất bại!");
            }
        }
    };

    const handleAddClick = () => {
        // Ensure form opens with empty initial data for creating new user
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (user) => {
        // Normalize user object so AdminaddForm fields prefill correctly
        const normalized = {
            // keep id for update call
            user_id: user.user_id ?? user.id ?? user._id,
            id: user.user_id ?? user.id ?? user._id,
            username: user.username || user.user_name || '',
            fullname: user.fullname || user.name || user.full_name || '',
            email: user.email || '',
            role: user.role || 'customer',
            status: user.status !== undefined ? user.status : (user.active !== undefined ? Number(user.active) : 1),
            // do not prefill password
            pass: ''
        };
        setEditingUser(normalized);
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            const id = editingUser?.user_id || editingUser?.id;
            
            // Payload chuẩn theo logic đăng ký (dùng 'pass' thay vì 'password' nếu DB báo lỗi)
            const payload = {
                username: formData.username,
                email: formData.email,
                fullname: formData.fullname,
                role: formData.role || 'customer',
                status: formData.status !== undefined ? Number(formData.status) : 1
            };

            // Kiểm tra field mật khẩu (dùng key 'pass' đồng bộ với RegisterForm)
            if (formData.pass && formData.pass.trim() !== '') {
                payload.pass = formData.pass;
            }

            if (id) {
                // Nếu Backend bắt buộc phải có mật khẩu khi update
                // (Dù thông báo lỗi này thường do logic phía server chưa xử lý trường hợp null)
                await updateUser(id, payload);
            } else {
                if (!formData.pass) {
                    alert("Mật khẩu là bắt buộc khi tạo người dùng mới!");
                    return;
                }
                await createUser(payload);
            }
            
            setIsFormOpen(false);
            loadUsers();
        } catch (error) {
            console.error("Save error details:", error);
            const detailError = error.data ? JSON.stringify(error.data) : (error.message || 'Lỗi hệ thống');
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const userFields = [
        { name: 'username', label: 'Tên đăng nhập', type: 'text', required: true },
        { name: 'fullname', label: 'Họ và tên', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'pass', label: 'Mật khẩu (Nhập để thay đổi)', type: 'text' },
        { name: 'role', label: 'Vai trò', type: 'select', options: [
            { value: 'customer', label: 'Khách hàng' },
            { value: 'admin', label: 'Admin' },
        ]},
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Kích hoạt' },
            { value: 0, label: 'Khóa' }
        ]},
    ];

    const columns = [
        { key: 'user_id', label: 'ID', render: (row) => row.user_id || row.id },
        {
            key: 'fullname',
            label: 'Họ và tên',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.fullname || row.name}</span>
        },
        { key: 'username', label: 'Tên đăng nhập' },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Vai trò',
            render: (row) => {
                const isAdmin = (row.role || '').toLowerCase() === 'admin';
                return <span style={{ padding: '4px 12px', borderRadius: '20px', background: isAdmin ? '#ede9fe' : '#e0f2fe', color: isAdmin ? '#7c3aed' : '#0284c7', fontWeight: 600, fontSize: '12px' }}>{row.role || 'customer'}</span>;
            }
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row) => {
                const active = Number(row.status) === 1;
                return <span style={{ padding: '4px 12px', borderRadius: '20px', background: active ? '#dcfce7' : '#fee2e2', color: active ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '12px' }}>{active ? 'Kích hoạt' : 'Khóa'}</span>;
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
                                onClick={() => handleDelete(row.user_id || row.id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Người dùng</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý tài khoản và phân quyền hệ thống theo API chuẩn.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={() => setViewTrash(!viewTrash)} style={{ background: viewTrash ? '#ef4444' : '#f1f5f9', color: viewTrash ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        {viewTrash ? 'Đóng Thùng rác' : 'Thùng rác'}
                    </Button>
                    {!viewTrash && (
                        <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm Người dùng
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
                        <Table columns={columns} data={users} />
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
