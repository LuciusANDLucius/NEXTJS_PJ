import axios from '@/lib/axiosInstance'

export const listBrands = async (params = {}) => {
	const res = await axios.get('/brands', { params })
	return res.data
}

export const getBrand = async (id) => {
	const res = await axios.get(`/brands/${id}`)
	return res.data
}

export const createBrand = async (payload) => {
	const res = await axios.post('/brands', payload)
	if (res.data && res.data.error) {
		throw new Error(res.data.error)
	}
	return res.data
}

export const updateBrand = async (id, payload) => {
	const res = await axios.put(`/brands/${id}`, payload)
	if (res.data && res.data.error) {
		throw new Error(res.data.error)
	}
	return res.data
}

export const deleteBrand = async (id) => {
	const res = await axios.delete(`/brands/${id}`)
	if (res.data && res.data.error) {
		throw new Error(res.data.error)
	}
	return res.data
}

export default { listBrands, getBrand, createBrand, updateBrand, deleteBrand }