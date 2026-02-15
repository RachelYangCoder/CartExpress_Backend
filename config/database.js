const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL not defined in .env");
    }

    mongoose.connect(DATABASE_URL);
    
    mongoose.connection
      .on("open", () => console.log("✓ Connected to MongoDB"))
      .on("close", () => console.log("✗ Disconnected from MongoDB"))
      .on("error", (error) => console.log("✗ MongoDB Error:", error));

    return mongoose.connection;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
