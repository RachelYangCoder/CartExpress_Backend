import './Navigation.css'

export default function Navigation({ cartCount, role, onNavigate, onRoleChange }) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1 onClick={() => onNavigate('home')}>🛒 CartExpress</h1>
        </div>
        
        <div className="nav-menu">
          <button onClick={() => onNavigate('home')} className="nav-link">
            Home
          </button>
          <button onClick={() => onNavigate('cart')} className="nav-link">
            Cart ({cartCount})
          </button>
          
          {role === 'admin' && (
            <button onClick={() => onNavigate('admin')} className="nav-link admin">
              Admin
            </button>
          )}
          
          <div className="nav-role">
            <select value={role} onChange={(e) => onRoleChange(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}
