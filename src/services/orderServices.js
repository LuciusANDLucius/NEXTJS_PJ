import axios from '@/lib/axiosInstance'

export const listOrders = async (params = {}) => {
	const res = await axios.get('/orders', { params })
	return res.data
}

export const getOrder = async (id) => {
	const res = await axios.get(`/orders/${id}`)
	return res.data
}

export const createOrder = async (payload) => {
	const res = await axios.post('/orders', payload)
	return res.data
}

export const updateOrder = async (id, payload) => {
	const res = await axios.put(`/orders/${id}`, payload)
	return res.data
}

export const deleteOrder = async (id) => {
	const res = await axios.delete(`/orders/${id}`)
	return res.data
}

export const updateOrderStatus = async (id, status) => {
	const res = await axios.patch(`/orders/${id}/status`, { status })
	return res.data
}

export default { listOrders, getOrder, createOrder, updateOrder, deleteOrder, updateOrderStatus }