import axios from '@/lib/axiosInstance'

export const listProducts = async (params={}) => {
  const res = await axios.get('/products', { params })
  // backend returns wrapper with data and pagination
  return res.data
}

export const getProduct = async (id) => {
  const res = await axios.get(`/products/${id}`)
  return res.data
}

export default { listProducts, getProduct }
