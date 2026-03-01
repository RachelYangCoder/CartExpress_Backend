///////////////////////////////
// DEPENDENCIES
///////////////////////////////
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const { PORT = 4000 } = process.env;

///////////////////////////////
// DATABASE
///////////////////////////////
connectDB();

///////////////////////////////
// MIDDLEWARE
///////////////////////////////

// Stripe webhook needs raw body — register BEFORE express.json()
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

///////////////////////////////
// ROUTES
///////////////////////////////
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/products",   require("./routes/productRoutes"));
app.use("/api/cart",       require("./routes/cartRoutes"));
app.use("/api/orders",     require("./routes/orderRoutes"));
app.use("/api/payments",   require("./routes/paymentRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

// Health check
app.get("/", (req, res) =>
  res.json({ success: true, message: "CartExpress API is running 🚀" })
);

///////////////////////////////
// ERROR HANDLING (must be last)
///////////////////////////////
app.use(notFound);
app.use(errorHandler);

///////////////////////////////
// LISTENER
///////////////////////////////
app.listen(PORT, () => console.log(`🚀 Server listening on PORT ${PORT}`));


