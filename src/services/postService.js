import axios from '@/lib/axiosInstance'

export const listPosts = async (params = {}) => {
  const res = await axios.get('/posts', { params })
  return res.data
}

export const getPost = async (id) => {
  const res = await axios.get(`/posts/${id}`)
  return res.data
}

export const createPost = async (payload) => {
  const res = await axios.post('/posts', payload)
  return res.data
}

export const updatePost = async (id, payload) => {
  const res = await axios.put(`/posts/${id}`, payload)
  return res.data
}

export const deletePost = async (id) => {
  const res = await axios.delete(`/posts/${id}`)
  return res.data
}

export default { listPosts, getPost, createPost, updatePost, deletePost }
