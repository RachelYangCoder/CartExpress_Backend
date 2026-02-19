# CartExpress - Shopping Platform

## Project Structure

```
CartExpress/
├── CartExpress_Backend/    (Node.js + MongoDB API)
└── CartExpress_Frontend/   (React + Vite)
```

## Features

### Customer Features
- Browse and search products
- View product details
- Add to cart & manage quantities
- Checkout with mock payment
- Order history

### Admin Features
- Manage products (create, edit, delete)
- Manage inventory
- View and update orders
- Order status tracking

## Quick Start

> **Requirements:** Node.js and MongoDB installed and running.

### Terminal 1 — Backend
```bash
cd CartExpress_Backend
npm install   # automatically creates .env from .env.example
npm run dev
```
Runs on `http://localhost:4000`

### Terminal 2 — Frontend
```bash
cd CartExpress_Frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`

> **No MongoDB?** The backend will still start and print a warning. DB-dependent routes (products, cart, orders) will return errors until MongoDB is running and `DATABASE_URL` is set in `.env`.

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `POST /api/cart/remove` - Remove from cart
- `POST /api/cart/update` - Update quantity
- `POST /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders/user/:userId` - User orders
- `GET /api/orders/:id` - Get order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status
- `GET /api/orders` - All orders (admin)

## Database

MongoDB with Mongoose ODM. Models include:
- User (authentication, profile, roles)
- Product (details, variants, categories)
- Cart (items, totals)
- Order (items, shipping, payment)

## Technologies

**Backend:** Node.js, Express, MongoDB, Mongoose
**Frontend:** React, Vite, Axios, CSS3

## Next Steps

1. Install MongoDB locally or use MongoDB Atlas
2. Seed database with sample products
3. Implement JWT authentication
4. Add payment gateway integration
5. Deploy to production
