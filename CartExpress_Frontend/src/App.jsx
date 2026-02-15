import { useState, useEffect } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminPage from './pages/AdminPage'
import Navigation from './components/Navigation'

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [role, setRole] = useState('customer') // or 'admin'

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  // Page routing
  let content
  switch (page) {
    case 'home':
      content = <HomePage onSelectProduct={(product) => {
        setSelectedProduct(product)
        setPage('product-detail')
      }} />
      break
    case 'product-detail':
      content = <ProductDetailPage
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onBack={() => setPage('home')}
      />
      break
    case 'cart':
      content = <CartPage
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={() => setPage('checkout')}
      />
      break
    case 'checkout':
      content = <CheckoutPage
        cart={cart}
        onSuccess={() => {
          setCart([])
          setPage('home')
        }}
      />
      break
    case 'admin':
      content = <AdminPage onNavigate={setPage} />
      break
    default:
      content = <HomePage onSelectProduct={(product) => {
        setSelectedProduct(product)
        setPage('product-detail')
      }} />
  }

  return (
    <div className="app">
      <Navigation
        cartCount={cart.length}
        role={role}
        onNavigate={setPage}
        onRoleChange={setRole}
      />
      <main className="main-content">
        {content}
      </main>
    </div>
  )
}
