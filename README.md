# CartExpress - Shopping Platform

A full-stack e-commerce app built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

**Live Backend:** https://cartexpress-backend.onrender.com

---

## Quick Start (Recommended)

The backend is already live on Render. You only need to run the frontend locally.

> **Requirements:** Node.js 18+

```bash
git clone -b r_wip https://github.com/RachelYangCoder/CartExpress_Backend.git
cd CartExpress_Backend/CartExpress_Frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:3000` (or next available port)

**That's it. No `.env`, no MongoDB setup needed.**

---

## Running Backend Locally (Optional)

Only needed if you want to run the backend locally instead of using Render.

**1. Create a `.env` in the project root:**

```
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cartexpress
PORT=4000
NODE_ENV=development
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**2. From the project root:**

```bash
npm install
npm run dev
```

- Backend → `http://localhost:4000`
- Frontend → `http://localhost:3000`

> To use your local backend, change `API_BASE` in `CartExpress_Frontend/src/services/api.js` to `http://localhost:4000/api`.

---

## Features

### Customer
- Browse and search products (live from MongoDB via Render)
- View product details
- Add to cart and manage quantities
- Checkout flow

### Admin
- Login / Register (auto-promoted to admin on register in dev)
- Create, view, and delete products — synced to database
- View and update order statuses — synced to database

---

## API Endpoints

**Auth**
- `POST /api/auth/register` — Register, returns JWT
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Current user *(requires token)*
- `POST /api/auth/make-admin` — Promote to admin *(dev only)*

**Products**
- `GET /api/products` — List products
- `GET /api/products/:id` — Single product
- `POST /api/products` — Create *(admin)*
- `PUT /api/products/:id` — Update *(admin)*
- `DELETE /api/products/:id` — Soft-delete *(admin)*

**Cart**
- `GET /api/cart` — Get cart
- `POST /api/cart/add` — Add item
- `POST /api/cart/remove` — Remove item
- `POST /api/cart/update` — Update quantity
- `POST /api/cart/clear` — Clear cart

**Orders**
- `POST /api/orders` — Create order
- `GET /api/orders/user/:userId` — User's orders
- `GET /api/orders/:id` — Single order
- `GET /api/orders` — All orders *(admin)*
- `PUT /api/orders/:id/status` — Update status *(admin)*

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken, bcryptjs) |
| Payments | Stripe |
| Hosting | Render |

---

## Next Steps

### 1. Wire Up Checkout → Orders
`CheckoutPage.jsx` has a mock form. It needs to call `POST /api/orders` with the customer's cart items on submit. Once orders are created, the Admin **Orders** tab will display them with live status updates (pending → confirmed → shipped → delivered).

### 2. Product Images
The backend `Product` model has an `images: []` field. To enable images:
- Add an image URL input to the Admin "Add Product" form
- Store publicly accessible URLs (e.g. [Cloudinary](https://cloudinary.com) or any direct image URL)
- `HomePage` already renders `<img src={product.images[0]} />` — it just shows "No Image" when the array is empty

### 3. UI Polish
The CSS structure is in place but the design needs work:
- Product cards (images, hover effects, better layout)
- Navigation (logo, cart item badge)
- Checkout page layout
- Mobile responsiveness

### 4. Customer Login / Register UI
Currently only the Admin page has auth. Customers need a login/register flow to access order history and sync their cart across devices.

### 5. Sync Cart to Backend
Cart is currently stored in `localStorage` only. Wiring it to `POST /api/cart/add` etc. would let logged-in customers persist their cart across devices and sessions.

### 6. Remove Dev-Only Endpoints Before Production
`POST /api/auth/make-admin` and `POST /api/auth/make-vendor` are open with no auth — remove them before going live.

### 7. Deploy Frontend to Production
The backend is already on Render. For the frontend, use **Vercel** (recommended) or **Netlify**:
```bash
cd CartExpress_Frontend
npm run build
# deploy the dist/ folder to Vercel or Netlify
```
`API_BASE` in `services/api.js` already points to the live Render URL — no changes needed.

---

## JWT Authentication

**How tokens are generated** — [controllers/authController.js](controllers/authController.js):
```js
jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
```
- Payload contains only `{ id }` — minimal by design
- Signed with `JWT_SECRET` stored on Render (never committed to the repo)
- Token expires based on `JWT_EXPIRES_IN` (set to `7d`)

**How tokens are verified** — [middleware/auth.js](middleware/auth.js):
```js
const decoded = jwt.verify(token, process.env.JWT_SECRET)
req.user = await User.findById(decoded.id)
```
Every protected route runs the `protect` middleware first, which reads the token from the `Authorization: Bearer <token>` header.

**Role-based access** — `authorize("admin")` runs after `protect` and checks `req.user.role === "admin"`. Registering alone gives `role: "customer"`. The dev-only `POST /api/auth/make-admin` endpoint promotes a user to admin — **remove this before production**.

**Frontend** — the token is stored in `localStorage` and automatically attached to every request via the axios interceptor in `CartExpress_Frontend/src/services/api.js`.

---

## Project Structure

```
CartExpress_Backend/
├── server.js
├── routes/
├── controllers/
├── model/
├── middleware/
├── config/
└── CartExpress_Frontend/
    └── src/
        ├── pages/
        ├── components/
        └── services/api.js
```
