import axios from '@/lib/axiosInstance'

export const listProducts = async (params = {}) => {
  const res = await axios.get('/products', { params })
  return res.data
}

export const getProduct = async (id) => {
  const res = await axios.get(`/products/${id}`)
  return res.data
}

export const createProduct = async (payload) => {
  const res = await axios.post('/products', payload)
  return res.data
}

export const updateProduct = async (id, payload) => {
  const res = await axios.put(`/products/${id}`, payload)
  return res.data
}

export const deleteProduct = async (id) => {
  const res = await axios.delete(`/products/${id}`)
  return res.data
}

export const getNewProducts = async (limit = 10) => {
  const res = await axios.get('/products/new', { params: { limit } })
  return res.data
}

export const getBestsellers = async (limit = 5) => {
  const res = await axios.get('/products/bestseller', { params: { limit } })
  return res.data
}

export const getRelatedProducts = async (id, limit = 5) => {
  const res = await axios.get(`/products/related/${id}`, { params: { limit } })
  return res.data
}

export default { listProducts, getProduct, createProduct, updateProduct, deleteProduct, getNewProducts, getBestsellers, getRelatedProducts }
