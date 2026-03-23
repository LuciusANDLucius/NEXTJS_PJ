import axios from '@/lib/axiosInstance'

export const listContacts = async (params = {}) => {
  const res = await axios.get('/contacts', { params })
  return res.data
}

export const getContact = async (id) => {
  const res = await axios.get(`/contacts/${id}`)
  return res.data
}

export const createContact = async (payload) => {
  const res = await axios.post('/contacts', payload)
  return res.data
}

export const updateContact = async (id, payload) => {
  const res = await axios.put(`/contacts/${id}`, payload)
  return res.data
}

export const deleteContact = async (id) => {
  const res = await axios.delete(`/contacts/${id}`)
  return res.data
}

export default { listContacts, getContact, createContact, updateContact, deleteContact }
