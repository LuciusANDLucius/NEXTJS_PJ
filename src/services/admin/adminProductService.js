import axios from '@/lib/axiosInstance';

export const productAdminService = {
  // Lấy danh sách (Theo API Doc: hỗ trợ phân trang)
  list: async (params = { trash: 0 }) => {
    const res = await axios.get('/products', { params });
    return res.data; // Trả về { data: [], totalPage: ... }
  },

  // Lấy chi tiết
  get: async (id) => {
    const res = await axios.get(`/products/${id}`);
    return res.data;
  },

  // Tạo mới (Payload: product_name, price, cat_id, brand_id,...)
  create: async (payload) => {
    const res = await axios.post('/products', payload);
    return res.data;
  },

  // Cập nhật
  update: async (id, payload) => {
    const res = await axios.put(`/products/${id}`, payload);
    return res.data;
  },

  // Xóa (Soft delete theo API Doc)
  delete: async (id) => {
    const res = await axios.delete(`/products/${id}`);
    return res.data;
  }
};