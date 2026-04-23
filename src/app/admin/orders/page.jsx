'use client';

import React, { useEffect, useState } from 'react';
import { listOrders, deleteOrder, updateOrder, updateOrderStatus } from '@/services/orderServices';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';

export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewTrash, setViewTrash] = useState(false);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await listOrders({ page: currentPage, order: 'desc', trash: viewTrash ? 1 : 0 });
            let fetchedOrders = res.data || res || [];
            
            // Sắp xếp đơn mới nhất lên đầu
            fetchedOrders = [...fetchedOrders].sort((a, b) => (b.order_id || b.id || 0) - (a.order_id || a.id || 0));

            setOrders(fetchedOrders);
            setTotalPages(res.totalPage || res.totalPages || res.last_page || 1);
        } catch (error) {
            console.error("Lỗi tải Orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const normalizeDetails = (details = []) => {
        if (!Array.isArray(details)) return [];
        return details.map(item => {
            const productId = item.product_id ?? item.id ?? item.productId ?? item.productId;
            const productName = item.product_name ?? item.name ?? item.title ?? '';
            const productImage = item.product_image ?? item.image ?? item.thumbnail ?? '';
            const price = Number(item.price ?? item.sale_price ?? item.salePrice ?? 0);
            const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
            return {
                product_id: productId,
                product_name: productName,
                product_image: productImage,
                price,
                quantity,
                // keep original raw item in case backend expects extra fields
                ...item
            };
        });
    };

    useEffect(() => {
        loadOrders();
    }, [currentPage, viewTrash]);

    const handleDelete = async (id) => {
        if (confirm("Chắc chắn muốn chuyển đơn hàng này vào thùng rác?")) {
            try {
                await deleteOrder(id);
                loadOrders(); 
            } catch (error) {
                alert("Xóa thất bại!");
            }
        }
    };

    const handleRestore = async (row) => {
        if (confirm("Khôi phục đơn hàng này về danh sách?")) {
            try {
                const id = row.order_id || row.id || row._id;
                const rawDetails = row.details || row.order_details || row.items || [];
                const payload = {
                    ...row,
                    trash: 0,
                    details: normalizeDetails(rawDetails)
                };
                await updateOrder(id, payload);
                loadOrders();
            } catch (error) {
                alert("Khôi phục thất bại!");
            }
        }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        const newStatus = prompt("Cập nhật trạng thái (0: Pending, 1: Processing, 2: Completed, 3: Cancelled):", currentStatus);
        if (newStatus !== null && newStatus !== String(currentStatus)) {
             try {
                 
                 const orderRow = orders.find(o => (o.order_id || o.id || o._id) === (id || o.order_id || o.id || o._id));
                 if (orderRow) {
                     const rawDetails = orderRow.details || orderRow.order_details || orderRow.items || [];
                     const payload = { ...orderRow, status: Number(newStatus), details: normalizeDetails(rawDetails) };
                     await updateOrder(id, payload);
                 } else {
                     await updateOrder(id, { status: Number(newStatus) });
                 }
                loadOrders();
             } catch(error) {
                 alert("Cập nhật trạng thái thất bại");
             }
        }
    };

    const columns = [
        { key: 'id', label: 'Mã đơn', render: (row) => '#' + (row.order_id || row.id || row._id) },
        { key: 'user', label: 'Tên Khách hàng', render: (row) => row.fullname || row.customer_name || row.user_id || 'Guest' },
        { 
            key: 'total', 
            label: 'Tổng tiền', 
            render: (row) => <span style={{fontWeight: 600, color: '#0f172a'}}>{row.total_amount ? row.total_amount.toLocaleString('vi-VN') + 'đ' : row.total ? row.total.toLocaleString('vi-VN') + 'đ' : '0đ'}</span>
        },
        { 
            key: 'status', 
            label: 'Trạng thái',
            render: (row) => {
                const s = String(row.status || 'pending').toLowerCase();
                let color = '#f59e0b';
                let bg = '#fef3c7';
                
                if (s.includes('complet') || s.includes('thành công')) { color = '#16a34a'; bg = '#dcfce7'; }
                if (s.includes('cancel') || s.includes('hủy')) { color = '#dc2626'; bg = '#fee2e2'; }
                if (s.includes('ship') || s.includes('giao')) { color = '#0284c7'; bg = '#e0f2fe'; }
                
                return <span style={{ padding: '6px 12px', borderRadius: '20px', background: bg, color: color, fontWeight: 700, fontSize: '13px', textTransform: 'capitalize' }}>{row.status || 'Pending'}</span>;
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
                                onClick={() => handleUpdateStatus(row.order_id || row.id || row._id, row.status)}
                                style={{ color: '#0284c7', background: '#e0f2fe', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                            >
                                Cập nhật
                            </button>
                            <button 
                                onClick={() => handleDelete(row.order_id || row.id || row._id)}
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
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Quản lý Đơn hàng</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Theo dõi và xử lý giao vận đơn hàng từ người dùng.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={() => setViewTrash(!viewTrash)} style={{ background: viewTrash ? '#ef4444' : '#f1f5f9', color: viewTrash ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        {viewTrash ? 'Đóng Thùng rác' : 'Thùng rác'}
                    </Button>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Đang nạp dữ liệu...</div>
                    ) : (
                        <>
                            <Table columns={columns} data={orders} />
                            
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
        </div>
    );
}
