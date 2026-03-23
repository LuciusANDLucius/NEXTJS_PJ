import axiosInstance from '../axiosInstance.js';

export const getProducts = async (limit = null) => {
    try {
        const response = await axiosInstance.get('/products');
        let data = response.data;
        // Xử lý các dạng trả về metadata
        if (data && data.metadata) {
             data = data.metadata;
        } else if (data && data.data) {
             data = data.data;
        } else if (Array.isArray(data)) {
             data = data;
        } else {
             return [];
        }

        if (limit && Array.isArray(data)) {
            return data.slice(0, limit);
        }
        return data;
    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        return [];
    }
};

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
         let data = response.data;
        if (data && data.metadata) data = data.metadata;
        else if (data && data.data) data = data.data;
        return data;
    } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        return [];
    }
};

export const getBanners = async () => {
    try {
        const response = await axiosInstance.get('/banners');
         let data = response.data;
        if (data && data.metadata) data = data.metadata;
        else if (data && data.data) data = data.data;
        return data;
    } catch (error) {
        console.error("Lỗi khi tải banner:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}`);
        let data = response.data;
        if (data && data.metadata) return data.metadata;
        if (data && data.data) return data.data;
        return data;
    } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        return null;
    }
};
