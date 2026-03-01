import { useState, useEffect } from 'react'
import './HomePage.css'
import { getProducts } from '../services/api'

export default function HomePage({ onSelectProduct }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [search])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts({ search })
      setProducts(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products')
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading products...</div>

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Welcome to CartExpress</h1>
        <p>Find the best products and shop with ease</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products">No products found. Try a different search.</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-card" onClick={() => onSelectProduct(product)}>
              <div className="product-image">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.shortDescription || product.description?.substring(0, 100)}</p>
                <div className="product-footer">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <button className="btn-view">View Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
