# 🛒 CartExpress - Quick Start Guide

## Current state

**Backend** - RESTful API with MongoDB  
**Frontend** - React UI built with Vite  
**Features** - Products, Cart, Orders, Admin Dashboard  
**Database Models** - User, Product, Cart, Order, Categories, Reviews, etc.

## Prerequisites

- Node.js v14+ 
- MongoDB (local or MongoDB Atlas)

## Installation

### 1. Backend Setup (Port 4000)

```bash
cd CartExpress_Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and set your MongoDB URL
# Example: DATABASE_URL=mongodb://localhost:27017/cartexpress
```

### 2. Frontend Setup (Port 3000)

```bash
cd CartExpress_Frontend

# Install dependencies
npm install
```

## Running the Application

### Terminal 1 - Start Backend Server
```bash
cd CartExpress_Backend
npm run dev
# Server running on http://localhost:4000
```

### Terminal 2 - Start Frontend App
```bash
cd CartExpress_Frontend
npm run dev
# App running on http://localhost:3000
```

## Project Structure

```
CartExpress_Backend/
├── config/        → Database configuration
├── controllers/   → Business logic for routes
├── model/         → MongoDB Mongoose models
├── routes/        → API endpoints
├── server.js      → Main server file
├── package.json   → Dependencies
└── .env.example   → Environment template

CartExpress_Frontend/
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
- Browse products with search
- View product details & variants
- Add/remove items from cart
- Checkout with mock payment
- Order tracking

### Admin Features
- Manage products (CRUD)
- Track inventory
- View all orders
- Update order status
- Product variants management

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

1. Set up MongoDB
2. Run backend: `npm run dev` (in CartExpress_Backend)
3. Run frontend: `npm run dev` (in CartExpress_Frontend)
4. Add sample products to database
5. Implement JWT authentication
6. Integrate payment gateway
7. Deploy to production

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
