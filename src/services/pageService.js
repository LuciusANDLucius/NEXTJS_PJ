import axios from '@/lib/axiosInstance'

export const listPages = async (params = {}) => {
  const res = await axios.get('/pages', { params })
  return res.data
}

export const getPage = async (id) => {
  const res = await axios.get(`/pages/${id}`)
  return res.data
}

export const createPage = async (payload) => {
  const res = await axios.post('/pages', payload)
  return res.data
}

export const updatePage = async (id, payload) => {
  const res = await axios.put(`/pages/${id}`, payload)
  return res.data
}

export const deletePage = async (id) => {
  const res = await axios.delete(`/pages/${id}`)
  return res.data
}

export default { listPages, getPage, createPage, updatePage, deletePage }
