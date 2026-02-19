# CartExpress - Shopping Platform

## Project Structure

```
CartExpress_Backend/
├── server.js
├── routes/
├── controllers/
├── model/
├── config/
└── CartExpress_Frontend/   (React + Vite)
```

## Features

### Customer Features
- Browse and search products (connected to backend)
- View product details
- Add to cart & manage quantities (local state only)
- Checkout with mock payment

### Admin Features (UI only — not yet connected to backend)
- Product management UI
- Order management UI

### Backend API (fully implemented, ready to connect)
- Full CRUD for products, cart, and orders

## Quick Start

> **Requirements:** Node.js 18+

```bash
git clone -b pablo-wip https://github.com/RachelYangCoder/CartExpress_Backend.git
cd CartExpress_Backend
npm install
npm run dev
```

- **Backend** → `http://localhost:4000`
- **Frontend** → `http://localhost:3000`

`npm install` auto-creates `.env` from `.env.example`. `npm run dev` installs frontend dependencies on first run, then starts both servers.

> **No MongoDB?** The server still starts. DB-dependent routes return errors until MongoDB is running and `DATABASE_URL` is set in `.env`.

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
- User, Product, Cart, Order
- Address, Categories, Inventory, Payments, Reviews

> Authentication is not yet implemented.

## Technologies

**Backend:** Node.js, Express, MongoDB, Mongoose
**Frontend:** React, Vite, Axios, CSS3

## Next Steps

1. Install MongoDB locally or use MongoDB Atlas
2. Seed database with sample products
3. Implement JWT authentication
4. Add payment gateway integration
5. Deploy to production
