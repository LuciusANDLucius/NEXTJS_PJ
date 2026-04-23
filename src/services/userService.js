import axios from '@/lib/axiosInstance'

export const listUsers = async (params = {}) => {
  const res = await axios.get('/users', { params })
  if (res.data?.error) throw new Error(res.data.error)
  return res.data
}

export const getUser = async (id) => {
  const res = await axios.get(`/users/${id}`)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data
}

export const createUser = async (payload) => {
  // Đảm bảo field mật khẩu đúng tên "password" theo API /users
  const body = {
    username: payload.username,
    email: payload.email,
    pass: payload.pass ?? payload.password,
    fullname: payload.fullname,
    role: payload.role ?? 'customer',
    status: payload.status ?? 1,
  }
  const res = await axios.post('/users', body)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data // { message: "User created successfully", id: ... }
}

export const updateUser = async (id, payload) => {
  // Khi update, chỉ gửi password nếu user thực sự muốn đổi
  const body = {
    username: payload.username,
    email: payload.email,
    fullname: payload.fullname,
    role: payload.role,
    status: payload.status,
    ...(payload.password || payload.pass ? { pass: payload.password ?? payload.pass } : {}),
  }
  const res = await axios.put(`/users/${id}`, body)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data
}

export const deleteUser = async (id) => {
  const res = await axios.delete(`/users/${id}`)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data
}

export default { listUsers, getUser, createUser, updateUser, deleteUser }