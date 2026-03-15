import axios from 'axios'

const API_BASE = 'https://cartexpress-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE,
})

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const makeAdmin = (email) => api.post('/auth/make-admin', { email })

// Products
export const getProducts = (query = {}) => {
  return api.get('/products', { params: query })
}

export const getProduct = (id) => {
  return api.get(`/products/${id}`)
}

export const createProduct = (data) => {
  return api.post('/products', data)
}

export const updateProduct = (id, data) => {
  return api.put(`/products/${id}`, data)
}

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`)
}

// Cart
export const getCart = (userId, sessionId) => {
  return api.get('/cart', {
    params: { userId, sessionId }
  })
}

export const addToCart = (data) => {
  return api.post('/cart/add', data)
}

export const removeFromCart = (data) => {
  return api.post('/cart/remove', data)
}

export const updateCartItem = (data) => {
  return api.post('/cart/update', data)
}

export const clearCart = (data) => {
  return api.post('/cart/clear', data)
}

// Orders
export const getUserOrders = (userId) => {
  return api.get(`/orders/user/${userId}`)
}

export const getOrder = (id) => {
  return api.get(`/orders/${id}`)
}

export const createOrder = (data) => {
  return api.post('/orders', data)
}

export const getAllOrders = (query = {}) => {
  return api.get('/orders', { params: query })
}

export const updateOrderStatus = (id, status) => {
  return api.put(`/orders/${id}/status`, { orderStatus: status })
}

export default api
