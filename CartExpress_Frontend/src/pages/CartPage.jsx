import './CartPage.css'

export default function CartPage({ cart, onRemoveFromCart, onUpdateQuantity, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="product-name">{item.name}</td>
                  <td className="price">${item.price.toFixed(2)}</td>
                  <td className="quantity">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td className="subtotal">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="action">
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button onClick={onCheckout} className="btn-checkout">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
