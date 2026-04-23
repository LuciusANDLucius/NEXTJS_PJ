import axios from '@/lib/axiosInstance'
import { getProduct } from '@/services/productService'

export const listOrders = async (params = {}) => {
  const res = await axios.get('/orders', { params })
  if (res.data?.error) throw new Error(res.data.error)
  return res.data // { success: true, data: [...] }
}

export const getOrder = async (id) => {
  const res = await axios.get(`/orders/${id}`)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data // { success: true, data: { ...order, details: [...] } }
}

export const createOrder = async (orderData, cartItems) => {
  // Support two call styles for backward compatibility:
  // 1) createOrder(orderData, cartItems)
  // 2) createOrder(payload) where payload.items is the cart array (used by checkout page)
  const rawItems = Array.isArray(cartItems) && cartItems.length ? cartItems : (orderData?.items || []);

  const normalizeItem = (item) => {
    const product_id = item.product_id ?? item.id ?? item.productId ?? null;
    const product_name = item.product_name ?? item.name ?? item.title ?? '';
    const product_image = item.product_image ?? item.image ?? item.thumbnail ?? '';
    const price = Number(item.sale_price ?? item.salePrice ?? item.price ?? 0) || 0;
    const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
    return { product_id, product_name, product_image, price, quantity, ...item };
  };

  const details = rawItems.map(normalizeItem);

  const enrichDetails = async (items) => {
    const ids = Array.from(new Set(items.map(i => i.product_id).filter(Boolean)));
    if (ids.length === 0) return items;
    const promises = ids.map(id => getProduct(id).then(res => res.data || res).catch(() => null));
    const results = await Promise.all(promises);
    const map = {};
    results.forEach(r => {
      if (!r) return;
      const pid = r.product_id ?? r.id ?? null;
      if (pid) map[pid] = r;
    });
    return items.map(it => {
      if (!it.product_name && it.product_id && map[it.product_id]) {
        it.product_name = map[it.product_id].product_name || map[it.product_id].name || map[it.product_id].title || it.product_name || '';
      }
      if (!it.product_image && it.product_id && map[it.product_id]) {
        it.product_image = map[it.product_id].image || map[it.product_id].thumbnail || it.product_image || '';
      }
      return it;
    });
  };

  const total = orderData?.total_amount ?? details.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

  const payload = {
    order: {
      user_id: orderData?.user_id ?? orderData?.user_id,
      customer_name: orderData?.fullname || orderData?.customer_name || '',
      address: orderData?.address || '',
      phone: orderData?.phone || '',
      email: orderData?.email || '',
      total: total,
      note: orderData?.note ?? '',
      status: orderData?.status ?? 1,
    },
    details: details,
  };

  // enrich details from product API for missing fields
  payload.details = await enrichDetails(payload.details || []);

  const res = await axios.post('/orders', payload)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data // { success: true, order_id: 15 }
}

export const updateOrder = async (id, payload) => {
  // If payload includes details, normalize and enrich them before updating
  if (payload && Array.isArray(payload.details)) {
    const normalizeItem = (item) => {
      const product_id = item.product_id ?? item.id ?? item.productId ?? null;
      const product_name = item.product_name ?? item.name ?? item.title ?? '';
      const product_image = item.product_image ?? item.image ?? item.thumbnail ?? '';
      const price = Number(item.sale_price ?? item.salePrice ?? item.price ?? 0) || 0;
      const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
      return { product_id, product_name, product_image, price, quantity, ...item };
    };
    payload.details = payload.details.map(normalizeItem);
    // enrich missing fields
    const ids = Array.from(new Set(payload.details.map(i => i.product_id).filter(Boolean)));
    if (ids.length > 0) {
      const promises = ids.map(id => getProduct(id).then(res => res.data || res).catch(() => null));
      const results = await Promise.all(promises);
      const map = {};
      results.forEach(r => { if (r) { const pid = r.product_id ?? r.id ?? null; if (pid) map[pid] = r; } });
      payload.details = payload.details.map(it => {
        if (!it.product_name && it.product_id && map[it.product_id]) it.product_name = map[it.product_id].product_name || map[it.product_id].name || map[it.product_id].title || it.product_name || '';
        if (!it.product_image && it.product_id && map[it.product_id]) it.product_image = map[it.product_id].image || map[it.product_id].thumbnail || it.product_image || '';
        return it;
      });
    }
  }

  const res = await axios.put(`/orders/${id}`, payload)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data
}

export const updateOrderStatus = async (id, status) => {
  const res = await axios.patch(`/orders/${id}/status`, { status })
  if (res.data?.error) throw new Error(res.data.error)
  return res.data
}

export const deleteOrder = async (id) => {
  const res = await axios.delete(`/orders/${id}`)
  if (res.data?.error) throw new Error(res.data.error)
  return res.data
}

export default { listOrders, getOrder, createOrder, updateOrder, updateOrderStatus, deleteOrder }