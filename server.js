///////////////////////////////
// DEPENDENCIES
////////////////////////////////
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./config/database");

// Import routes
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

///////////////////////////////
// CONFIG
////////////////////////////////
const { PORT = 4000 } = process.env;
const app = express();

///////////////////////////////
// MIDDLEWARE
////////////////////////////////
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
connectDB();

///////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", (req, res) => {
  res.json({ message: "CartExpress API" });
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}\n`);
});


