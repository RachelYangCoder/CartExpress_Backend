# CartExpress - Quick Start Guide

## Current State

**Backend** — RESTful API with MongoDB, deployed live on Render
**Frontend** — React + Vite, connects to live backend
**Auth** — JWT-based (register/login, admin role)
**Features** — Products, Cart, Orders, Admin Dashboard (all wired to real API)

---

## Quickest Way to Run (No Backend Setup Needed)

The backend is already live at https://cartexpress-backend.onrender.com

```bash
git clone -b r_wip https://github.com/RachelYangCoder/CartExpress_Backend.git
cd CartExpress_Backend/CartExpress_Frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:3000` (or next available port)

---

## Running Backend Locally (Optional)

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Create `.env` in the project root

```
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cartexpress
PORT=4000
NODE_ENV=development
JWT_SECRET=<random string, e.g. run: openssl rand -base64 32>
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...       # only needed for payment testing
STRIPE_WEBHOOK_SECRET=whsec_...     # only needed for payment testing
```

> `JWT_SECRET` and `JWT_EXPIRES_IN` are required — login/register will fail without them.

### 2. Run

```bash
npm install
npm run dev
```

- Backend → `http://localhost:4000`
- Frontend → `http://localhost:3000`

> To point the frontend at your local backend, change `API_BASE` in `CartExpress_Frontend/src/services/api.js` to `http://localhost:4000/api`.

---

## Project Structure

```
CartExpress_Backend/
├── config/        → Database connection
├── controllers/   → Business logic (auth, products, cart, orders, payments)
├── middleware/    → JWT auth (protect, authorize)
├── model/         → Mongoose models
├── routes/        → API route definitions
├── server.js      → Entry point
└── CartExpress_Frontend/
    └── src/
        ├── components/    → Navigation
        ├── pages/         → HomePage, ProductDetailPage, CartPage, CheckoutPage, AdminPage
        └── services/api.js → All API calls + JWT interceptor
```

---

## Features

### Customer
- Browse and search products (live from MongoDB)
- View product details
- Add/remove/update cart items
- Checkout flow

### Admin
- Login / Register (auto-promoted to admin in dev via `/api/auth/make-admin`)
- Create, view, delete products — persisted to database
- View all orders and update statuses — persisted to database

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register, returns JWT
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Current user *(requires token)*
- `POST /api/auth/make-admin` — Promote to admin *(dev only — remove in production)*

### Products
- `GET /api/products` — List all products (supports `search`, `category`, `minPrice`, `maxPrice`)
- `GET /api/products/:id` — Single product
- `POST /api/products` — Create *(admin)*
- `PUT /api/products/:id` — Update *(admin)*
- `DELETE /api/products/:id` — Soft-delete *(admin)*

### Cart
- `GET /api/cart` — Get cart
- `POST /api/cart/add` — Add item
- `POST /api/cart/remove` — Remove item
- `POST /api/cart/update` — Update quantity
- `POST /api/cart/clear` — Clear cart

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders/user/:userId` — User's orders
- `GET /api/orders/:id` — Single order
- `GET /api/orders` — All orders *(admin)*
- `PUT /api/orders/:id/status` — Update status *(admin)*

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't compile
```bash
rm -rf node_modules/.vite
npm run dev
```

### MongoDB connection error
- Verify `DATABASE_URL` is set correctly in `.env`
- Ensure your Atlas cluster allows connections from your IP

### Login/Register fails locally
- Make sure `JWT_SECRET` and `JWT_EXPIRES_IN` are set in `.env`

---

## Next Steps

1. Wire up `CheckoutPage.jsx` to `POST /api/orders`
2. Add image URL support to the Admin product form
3. UI polish — product card images, mobile layout
4. Deploy frontend to Vercel or Netlify
5. Remove `make-admin` and `make-vendor` endpoints before production

---

## Resources

- **Express**: https://expressjs.com
- **Mongoose**: https://mongoosejs.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Axios**: https://axios-http.com
- **JWT**: https://jwt.io

---

## Production Checklist

- [ ] Remove `/api/auth/make-admin` and `/api/auth/make-vendor` routes
- [ ] Validate all inputs (frontend & backend)
- [ ] Configure CORS to allow only your frontend domain
- [ ] Add rate limiting
- [ ] Set up HTTPS/SSL
- [ ] Add unit & integration tests
- [ ] Set all secrets in hosting environment (never commit `.env`)
