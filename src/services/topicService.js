import axios from '@/lib/axiosInstance'

export const listTopics = async (params = {}) => {
  const res = await axios.get('/topics', { params })
  return res.data
}

export const getTopic = async (id) => {
  const res = await axios.get(`/topics/${id}`)
  return res.data
}

export const createTopic = async (payload) => {
  const res = await axios.post('/topics', payload)
  return res.data
}

export const updateTopic = async (id, payload) => {
  const res = await axios.put(`/topics/${id}`, payload)
  return res.data
}

export const deleteTopic = async (id) => {
  const res = await axios.delete(`/topics/${id}`)
  return res.data
}

export default { listTopics, getTopic, createTopic, updateTopic, deleteTopic }
