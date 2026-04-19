import axiosInstance from '@/lib/axiosInstance';

/**
 * Upload 1 file ảnh
 * @param {File} file
 * @returns {{ file: string }} - URL của file đã upload
 */
export const uploadSingle = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axiosInstance.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data; // { message, file: "http://localhost:5000/uploads/xxx.jpg" }
};

/**
 * Upload nhiều file ảnh (tối đa 5)
 * @param {File[]} files
 * @returns {{ files: string[] }} - Mảng URL
 */
export const uploadMultiple = async (files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));

  const res = await axiosInstance.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data; // { message, files: [...] }
};

export default { uploadSingle, uploadMultiple };
