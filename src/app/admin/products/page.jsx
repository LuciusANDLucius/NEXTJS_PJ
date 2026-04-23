'use client';

import React, { useEffect, useState } from 'react';
import { productAdminService } from '@/services/admin/adminProductService';
import { listOrders } from '@/services/orderServices';
import { listCategories } from '@/services/categoriesServices';
import { listBrands } from '@/services/brandServices';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import AdminaddForm from '@/components/admin/table/AdminaddForm';

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination, Filter & Trash state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewTrash, setViewTrash] = useState(false); // Chế độ xem thùng rác

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes, brandRes] = await Promise.all([
                productAdminService.list({
                    trash: viewTrash ? 1 : 0,
                    page: currentPage,
                    name: searchQuery,
                    search: searchQuery,
                    order: 'asc',
                    sort: 'asc'
                }),
                listCategories(),
                listBrands()
            ]);
            let fetchedProducts = prodRes.data || prodRes || [];

            // Chuẩn hóa dữ liệu
            const normalizedData = fetchedProducts.map(item => ({
                ...item,
                product_name: item.product_name || item.name || '',
            }));

            // Sắp xếp ngược lại: ID lớn nhất (mới nhất) sẽ lên đầu danh sách
            const sortedProducts = [...normalizedData].sort((a, b) => (b.product_id || 0) - (a.product_id || 0));

            setProducts(sortedProducts);
            setTotalPages(prodRes.totalPage || prodRes.totalPages || prodRes.last_page || 1);

            // Gọi categories và brands
            setCategories(catRes.data || catRes || []);
            setBrands(brandRes.data || brandRes || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        // Reset page khi chuyển tab Thùng rác
    }, [currentPage, searchQuery, viewTrash]);

    const handleDelete = async (id) => {
        try {
                // Kiểm tra xem sản phẩm có xuất hiện trong bất kỳ đơn hàng nào không
                let hasOrders = false;
                try {
                    const ordersRes = await listOrders({ product_id: id, limit: 1 });
                    // Backend có thể trả về các dạng khác nhau: { data: [...] } hoặc trực tiếp array
                    const ordersArray = ordersRes?.data ?? ordersRes ?? [];
                    if (Array.isArray(ordersArray) && ordersArray.length > 0) hasOrders = true;
                } catch (checkErr) {
                    // Nếu API không hỗ trợ lọc theo product_id, bỏ qua kiểm tra (log để debug)
                    console.warn('Không thể kiểm tra đơn hàng cho sản phẩm trước khi xóa:', checkErr);
                }

                if (hasOrders) {
                    alert('Sản phẩm đang có trong đơn hàng, không được xóa. Vui lòng ẩn sản phẩm hoặc liên hệ quản trị.');
                    return;
                }

                if (confirm("Bạn có chắc muốn chuyển sản phẩm này vào thùng rác?")) {
                    try {
                        await productAdminService.delete(id);
                        loadProducts();
                    } catch (error) {
                        const detailError = error.data ? JSON.stringify(error.data) : error.Message || 'Lỗi 500';
                        alert(`Xóa thất bại! Backend báo: ${detailError}`);
                    }
                }
            } catch (outerErr) {
                console.error('Lỗi khi kiểm tra/xóa sản phẩm:', outerErr);
                alert('Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.');
            }
    };

    const handleRestore = async (row) => {
        if (confirm("Khôi phục sản phẩm này về danh sách hoạt động?")) {
            try {
                const id = row.product_id || row.id;
                // Sử dụng PUT với payload tối thiểu để khôi phục
                const payload = {
                    product_name: row.product_name || row.name || '',
                    cat_id: row.cat_id,
                    brand_id: row.brand_id,
                    price: row.price || 0,
                    status: row.status !== undefined ? Number(row.status) : 1,
                    trash: 0
                };
                await productAdminService.update(id, payload);
                loadProducts();
            } catch (error) {
                alert("Khôi phục thất bại.");
            }
        }
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = async (id) => {
        try {
            const res = await productAdminService.get(id);
            if (res && res.data) {
                setEditingProduct(res.data);
            } else {
                const prod = products.find(p => p.product_id === id);
                setEditingProduct(prod);
            }
        } catch (e) {
            const prod = products.find(p => p.product_id === id);
            setEditingProduct(prod);
        }
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            // Lọc và ép kiểu dữ liệu chuẩn (tránh gửi string "1" thay vì int 1 vào DB gây lỗi 500)
            const generateAlias = (str) => {
                if (!str) return '';
                return str.toString().toLowerCase()
                    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
                    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
                    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
                    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
                    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
                    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
                    .replace(/đ/gi, 'd')
                    .replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '')
                    .replace(/ /gi, "-")
                    .replace(/\-\-\-\-\-/gi, '-')
                    .replace(/\-\-\-\-/gi, '-')
                    .replace(/\-\-\-/gi, '-')
                    .replace(/\-\-/gi, '-')
                    .replace(/^\-+|\-+$/g, '');
            };

            const payload = {
                product_name: formData.product_name,
                alias: formData.alias || generateAlias(formData.product_name),
                price: formData.price ? Number(formData.price) : 0,
                sale_price: formData.sale_price ? Number(formData.sale_price) : 0,
                image: formData.image || '',
                cat_id: formData.cat_id ? Number(formData.cat_id) : null,
                brand_id: formData.brand_id ? Number(formData.brand_id) : null,
                summary: formData.summary || '',
                detail: formData.detail || '',
                tag: formData.tag || '',
                status: formData.status !== undefined ? Number(formData.status) : 1
            };

            if (editingProduct && editingProduct.product_id) {
                await productAdminService.update(editingProduct.product_id, payload);
            } else {
                await productAdminService.create(payload);
            }
            setIsFormOpen(false);
            setCurrentPage(1); // Set về trang đầu để thấy file vừa sửa
            loadProducts();
        } catch (error) {
            console.error("Save error:", error);
            // In error data từ axios để dễ debug
            const detailError = error.data ? JSON.stringify(error.data) : error.Message || 'Lỗi 500';
            alert(`Lưu thất bại! Backend báo: ${detailError}`);
        }
    };

    const productFields = [
        { name: 'product_name', label: 'Tên sản phẩm', type: 'text', required: true },
        { name: 'price', label: 'Giá bán', type: 'number', required: true },
        { name: 'sale_price', label: 'Giá khuyến mãi', type: 'number' },
        { name: 'image', label: 'Hình ảnh sản phẩm', type: 'image' },
        {
            name: 'cat_id',
            label: 'Danh mục',
            type: 'select',
            required: true,
            options: categories.map(c => ({ value: c.cat_id || c.id, label: c.cat_name || c.name }))
        },
        {
            name: 'brand_id',
            label: 'Thương hiệu',
            type: 'select',
            required: true,
            options: brands.map(b => ({ value: b.brand_id || b.id, label: b.brand_name || b.name }))
        },
        { name: 'summary', label: 'Mô tả ngắn', type: 'textarea' },
        { name: 'detail', label: 'Mô tả chi tiết', type: 'textarea' },
        { name: 'alias', label: 'Alias (URL Slug)', type: 'text' },
        { name: 'tag', label: 'Tag SEO', type: 'text' },
        { name: 'status', label: 'Trạng thái', type: 'select', options: [
            { value: 1, label: 'Hiển thị' },
            { value: 0, label: 'Ẩn' },
        ]},
    ];

    const columns = [
        { key: 'product_id', label: 'ID' },
        {
            key: 'image',
            label: 'Hình ảnh',
            render: (row) => {
                let imgUrl = row.image;
                if (!imgUrl) {
                    return <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '6px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#94a3b8' }}>Trống</div>;
                }
                if (!imgUrl.startsWith('http')) {
                    imgUrl = `http://localhost:5000/uploads/${imgUrl}`;
                }
                return (
                    <img src={imgUrl} alt="" width="50" height="50" style={{ borderRadius: '6px', border: '1px solid #e2e8f0', objectFit: 'cover' }} />
                )
            }
        },
        { key: 'product_name', label: 'Tên sản phẩm' },
        {
            key: 'price',
            label: 'Giá bán',
            render: (row) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.price?.toLocaleString('vi-VN')}đ</span>
        },
        { key: 'cat_name', label: 'Danh mục' },
        {
            key: 'actions',
            label: 'Thao tác',
            render: (row) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {!viewTrash ? (
                        <>
                            <button
                                onClick={() => handleEditClick(row.product_id)}
                                style={{ color: '#0284c7', background: '#e0f2fe', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(row.product_id)}
                                style={{ color: '#dc2626', background: '#fee2e2', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                            >
                                Xóa
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleRestore(row)}
                                style={{ color: '#16a34a', background: '#dcfce7', padding: '6px 12px', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', fontWeight: 500, transition: '0.2s' }}
                            >
                                Khôi phục
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Sản phẩm</h1>
                    <p style={{ margin: 0, color: '#64748b' }}>Quản lý kho hàng, thông tin và giá bán sản phẩm.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={() => { setViewTrash(!viewTrash); setCurrentPage(1); }} style={{ background: viewTrash ? '#ef4444' : '#f1f5f9', color: viewTrash ? '#fff' : '#475569', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        {viewTrash ? 'Đóng Thùng rác' : 'Thùng rác'}
                    </Button>
                    {!viewTrash && (
                        <Button onClick={handleAddClick} style={{ background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '15px' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm Sản phẩm
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
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (setCurrentPage(1), setSearchQuery(searchTerm))}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#334155' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => { setCurrentPage(1); setSearchQuery(searchTerm); }}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #3b82f6', background: '#e0f2fe', color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                            Lọc & Tìm kiếm
                        </button>
                    </div>
                </div>

                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
                    ) : (
                        <>
                            <Table columns={columns} data={products} />

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

            <AdminaddForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                fields={productFields}
                initialData={editingProduct}
                title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
            />
        </div>
    );
}