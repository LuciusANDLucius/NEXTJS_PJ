import axios from '@/lib/axiosInstance'

export const listLinks = async (params = {}) => {
  const res = await axios.get('/links', { params })
  return res.data
}

export const getLink = async (id) => {
  const res = await axios.get(`/links/${id}`)
  return res.data
}

export const createLink = async (payload) => {
  const res = await axios.post('/links', payload)
  return res.data
}

export const updateLink = async (id, payload) => {
  const res = await axios.put(`/links/${id}`, payload)
  return res.data
}

export const deleteLink = async (id) => {
  const res = await axios.delete(`/links/${id}`)
  return res.data
}

export default { listLinks, getLink, createLink, updateLink, deleteLink }
