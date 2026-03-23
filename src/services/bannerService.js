import axios from '@/lib/axiosInstance'

export const listBanners = async (params = {}) => {
  const res = await axios.get('/banners', { params })
  return res.data
}

export const getBanner = async (id) => {
  const res = await axios.get(`/banners/${id}`)
  return res.data
}

export const createBanner = async (payload) => {
  const res = await axios.post('/banners', payload)
  return res.data
}

export const updateBanner = async (id, payload) => {
  const res = await axios.put(`/banners/${id}`, payload)
  return res.data
}

export const deleteBanner = async (id) => {
  const res = await axios.delete(`/banners/${id}`)
  return res.data
}

export default { listBanners, getBanner, createBanner, updateBanner, deleteBanner }
