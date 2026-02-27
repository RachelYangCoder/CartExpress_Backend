import { useState } from 'react'
import './AdminPage.css'

export default function AdminPage({ onNavigate }) {
  const [adminTab, setAdminTab] = useState('products') // or 'orders'

  return (
    <div className="admin-page">
      <button onClick={() => onNavigate('home')} className="btn-back">← Back</button>

      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage products and orders</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${adminTab === 'products' ? 'active' : ''}`}
          onClick={() => setAdminTab('products')}
        >
          Products
        </button>
        <button
          className={`tab ${adminTab === 'orders' ? 'active' : ''}`}
          onClick={() => setAdminTab('orders')}
        >
          Orders
        </button>
      </div>

      {adminTab === 'products' && <ProductsAdmin />}
      {adminTab === 'orders' && <OrdersAdmin />}
    </div>
  )
}

function ProductsAdmin() {
  const [products, setProducts] = useState([
    { id: '1', name: 'Sample Product 1', sku: 'SKU001', price: 29.99, stock: 100 },
    { id: '2', name: 'Sample Product 2', sku: 'SKU002', price: 49.99, stock: 50 }
  ])
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Products Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h3>Add New Product</h3>
          <form>
            <input type="text" placeholder="Product Name" required />
            <input type="text" placeholder="SKU" required />
            <input type="number" placeholder="Price" step="0.01" required />
            <input type="number" placeholder="Stock" required />
            <input type="textarea" placeholder="Description" />
            <button type="submit" className="btn-primary">Create Product</button>
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
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <button className="btn-edit">Edit</button>
                <button className="btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OrdersAdmin() {
  const [orders] = useState([
    { id: 'ORD001', customer: 'John Doe', total: 299.99, status: 'pending', date: '2024-01-15' },
    { id: 'ORD002', customer: 'Jane Smith', total: 149.99, status: 'shipped', date: '2024-01-14' }
  ])

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Orders Management</h2>
      </div>

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
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <span className={`status ${order.status}`}>{order.status}</span>
              </td>
              <td>{order.date}</td>
              <td>
                <button className="btn-edit">Update Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
