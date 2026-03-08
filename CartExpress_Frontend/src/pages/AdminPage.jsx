import { useState, useEffect } from 'react'
import './AdminPage.css'
import { login, register, makeAdmin, getProducts, createProduct, deleteProduct, getAllOrders, updateOrderStatus } from '../services/api'

export default function AdminPage({ onNavigate }) {
  const [adminTab, setAdminTab] = useState('products')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)
    try {
      let res
      if (authMode === 'login') {
        res = await login({ email: authForm.email, password: authForm.password })
      } else {
        res = await register(authForm)
        await makeAdmin(authForm.email)
        res = await login({ email: authForm.email, password: authForm.password })
      }
      const t = res.data.token
      localStorage.setItem('token', t)
      setToken(t)
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    return (
      <div className="admin-page">
        <button onClick={() => onNavigate('home')} className="btn-back">← Back</button>
        <div className="admin-header">
          <h1>Admin Login</h1>
          <p>Sign in to access the dashboard</p>
        </div>
        <div className="form-section" style={{ maxWidth: 400, margin: '0 auto' }}>
          <div className="admin-tabs" style={{ marginBottom: 16 }}>
            <button className={`tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>Login</button>
            <button className={`tab ${authMode === 'register' ? 'active' : ''}`} onClick={() => setAuthMode('register')}>Register</button>
          </div>
          {authError && <div className="error" style={{ marginBottom: 12 }}>{authError}</div>}
          <form onSubmit={handleAuth}>
            {authMode === 'register' && (
              <>
                <input type="text" placeholder="First Name" required value={authForm.firstName} onChange={e => setAuthForm({ ...authForm, firstName: e.target.value })} />
                <input type="text" placeholder="Last Name" required value={authForm.lastName} onChange={e => setAuthForm({ ...authForm, lastName: e.target.value })} />
              </>
            )}
            <input type="email" placeholder="Email" required value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} />
            <input type="password" placeholder="Password" required value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
            <button type="submit" className="btn-primary" disabled={authLoading}>
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register & Become Admin'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <button onClick={() => onNavigate('home')} className="btn-back">← Back</button>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage products and orders</p>
        </div>
        <button className="btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      <div className="admin-tabs">
        <button className={`tab ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}>Products</button>
        <button className={`tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}>Orders</button>
      </div>
      {adminTab === 'products' && <ProductsAdmin />}
      {adminTab === 'orders' && <OrdersAdmin />}
    </div>
  )
}

function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', stockQuantity: '', description: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await getProducts()
      setProducts(res.data.data?.products || [])
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createProduct({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sku: formData.sku,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        description: formData.description,
      })
      setFormData({ name: '', sku: '', price: '', stockQuantity: '', description: '' })
      setShowForm(false)
      loadProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return
    try {
      await deleteProduct(id)
      loadProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product')
    }
  }

  if (loading) return <div className="loading">Loading products...</div>

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Products Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {showForm && (
        <div className="form-section">
          <h3>Add New Product</h3>
          <form onSubmit={handleCreate}>
            <input type="text" placeholder="Product Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="SKU" required value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
            <input type="number" placeholder="Price" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            <input type="number" placeholder="Stock" required value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} />
            <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Create Product'}</button>
          </form>
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No products found</td></tr>
          ) : (
            products.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>${product.price?.toFixed(2)}</td>
                <td>{product.stockQuantity}</td>
                <td><button className="btn-danger" onClick={() => handleDelete(product._id)}>Delete</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await getAllOrders()
      setOrders(res.data.data?.orders || res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      loadOrders()
    } catch (err) {
      setError('Failed to update order status')
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Orders Management</h2>
      </div>
      {error && <div className="error">{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found</td></tr>
          ) : (
            orders.map(order => (
              <tr key={order._id}>
                <td>{order._id?.slice(-6).toUpperCase()}</td>
                <td>{order.userId?.email || order.guestEmail || 'Guest'}</td>
                <td>${order.totalAmount?.toFixed(2)}</td>
                <td><span className={`status ${order.orderStatus}`}>{order.orderStatus}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select value={order.orderStatus} onChange={e => handleStatusUpdate(order._id, e.target.value)} className="btn-edit">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
