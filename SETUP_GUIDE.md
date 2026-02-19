# CartExpress - Quick Start Guide

## Current state

**Backend** - RESTful API with MongoDB  
**Frontend** - React UI built with Vite  
**Features** - Products, Cart, Orders, Admin Dashboard  
**Database Models** - User, Product, Cart, Order, Categories, Reviews, etc.

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas) — optional to start, required for data

## Installation & Running

```bash
git clone -b pablo-wip https://github.com/RachelYangCoder/CartExpress_Backend.git
cd CartExpress_Backend
npm install
npm run dev
```

- `npm install` installs backend dependencies and auto-creates `.env` from `.env.example`
- `npm run dev` installs frontend dependencies on first run, then starts both servers
- **Backend** → http://localhost:4000
- **Frontend** → http://localhost:3000

## Project Structure

```
CartExpress_Backend/
├── config/        → Database configuration
├── controllers/   → Business logic for routes
├── model/         → MongoDB Mongoose models
├── routes/        → API endpoints
├── server.js      → Main server file
├── package.json   → Dependencies
├── .env.example   → Environment template
└── CartExpress_Frontend/
    ├── src/
    │   ├── components/    → Reusable components
    │   ├── pages/         → Page components
    │   ├── services/      → API communication
    │   ├── App.jsx        → Main app component
    │   └── index.css      → Global styles
    ├── index.html     → Entry point
    ├── vite.config.js → Vite configuration
    └── package.json   → Dependencies
```

## API Endpoints Overview

### Products API
- `GET /api/products` - List all products with search/filter
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart API
- `GET /api/cart?userId=...` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item
- `POST /api/cart/update` - Update quantity
- `POST /api/cart/clear` - Empty cart

### Orders API
- `GET /api/orders/user/:userId` - User's orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders` - All orders (admin)

## Features

### Customer Features
- Browse products with search (connected to backend)
- View product details
- Add/remove items from cart (local state only)
- Checkout with mock payment

### Admin Features (UI only — not yet connected to backend)
- Manage products (CRUD)
- View all orders
- Update order status

## Database Setup

### Using MongoDB Locally
```bash
# Install MongoDB from: https://www.mongodb.com/try/download/community
# Start MongoDB service
mongod

# Update .env
DATABASE_URL=mongodb://localhost:27017/cartexpress
```

### Using MongoDB Atlas (Cloud)
```
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update .env with connection string
```

## Testing the APIs

Example request:
```
GET http://localhost:4000/api/products
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't compile
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### MongoDB connection error
- Verify MongoDB is running
- Check DATABASE_URL in .env
- Ensure network access if using Atlas

## Next Steps

1. Set up MongoDB and update `DATABASE_URL` in `.env`
2. Seed database with sample products
3. Implement JWT authentication
4. Connect Admin and Cart/Checkout pages to backend
5. Integrate payment gateway
6. Deploy to production

## Resources

- **Express Docs**: https://expressjs.com
- **MongoDB/Mongoose**: https://mongoosejs.com
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Axios**: https://axios-http.com

## File Structure Summary

- Components in `src/components/` with their own CSS
- Pages in `src/pages/` - HomePage, ProductDetailPage, CartPage, CheckoutPage, AdminPage
- Services in `src/services/` - api.js for all API calls
- Clear separation of concerns with controllers on backend

## Production Checklist

- [ ] Add JWT authentication
- [ ] Validate all inputs (frontend & backend)
- [ ] Add error handling & logging
- [ ] Implement rate limiting
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Add unit & integration tests
- [ ] Deploy to hosting (Heroku, Railway, Vercel, etc.)
