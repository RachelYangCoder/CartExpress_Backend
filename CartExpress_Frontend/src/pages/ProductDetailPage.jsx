import { useState } from 'react'
import './ProductDetailPage.css'

export default function ProductDetailPage({ product, onAddToCart, onBack }) {
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return <div>Loading...</div>
  }

  const handleAddToCart = () => {
    onAddToCart({ id: product._id, ...product, quantity })
    alert(`Added ${quantity} to cart!`)
    setQuantity(1)
  }

  return (
    <div className="product-detail-page">
      <button onClick={onBack} className="btn-back">← Back</button>

      <div className="product-detail-container">
        <div className="product-image-section">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} />
          ) : (
            <div className="placeholder-image">No Image</div>
          )}
        </div>

        <div className="product-details-section">
          <h1>{product.name}</h1>
          
          <div className="product-meta">
            <span className="sku">SKU: {product.sku}</span>
            {product.comparePrice && (
              <span className="compare-price">Original: ${product.comparePrice.toFixed(2)}</span>
            )}
          </div>

          <div className="product-pricing">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="discount">
                Save ${(product.comparePrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="product-variants">
              <h3>Variants</h3>
              <div className="variants-list">
                {product.variants.map((variant, idx) => (
                  <div key={idx} className="variant-item">
                    <p className="variant-name">{variant.name}</p>
                    {variant.attributes && Object.entries(variant.attributes).map(([key, value]) => (
                      <span key={key} className="variant-attr">{key}: {value}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <button onClick={handleAddToCart} className="btn-add-to-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
