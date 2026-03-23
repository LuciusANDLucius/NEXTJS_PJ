import axios from '@/lib/axiosInstance'

export const listCategories = async (params = {}) => {
	const res = await axios.get('/categories', { params })
	return res.data
}

export const getCategory = async (id) => {
	const res = await axios.get(`/categories/${id}`)
	return res.data
}

export const createCategory = async (payload) => {
	const res = await axios.post('/categories', payload)
	return res.data
}

export const updateCategory = async (id, payload) => {
	const res = await axios.put(`/categories/${id}`, payload)
	return res.data
}

export const deleteCategory = async (id) => {
	const res = await axios.delete(`/categories/${id}`)
	return res.data
}

export default { listCategories, getCategory, createCategory, updateCategory, deleteCategory }