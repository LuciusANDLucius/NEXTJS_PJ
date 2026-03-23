//chỉ làm demo, chưa kết nối backend nên chưa test được
import axios from '@/lib/axiosInstance'

export const listUsers = async (params = {}) => {
  const res = await axios.get('/users', { params })
  return res.data
}

export const getUser = async (id) => {
  const res = await axios.get(`/users/${id}`)
  return res.data
}

export const createUser = async (payload) => {
  const res = await axios.post('/users', payload)
  return res.data
}

export const updateUser = async (id, payload) => {
  const res = await axios.put(`/users/${id}`, payload)
  return res.data
}

export const deleteUser = async (id) => {
  const res = await axios.delete(`/users/${id}`)
  return res.data
}

export default { listUsers, getUser, createUser, updateUser, deleteUser }
