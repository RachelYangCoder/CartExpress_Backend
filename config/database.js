const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL not defined in .env");
    }

    await mongoose.connect(DATABASE_URL);
    
    mongoose.connection
      .on("open", () => console.log("✓ Connected to MongoDB"))
      .on("close", () => console.log("✗ Disconnected from MongoDB"))
      .on("error", (error) => console.log("✗ MongoDB Error:", error));

    return mongoose.connection;
  } catch (error) {
    console.warn("⚠ MongoDB not connected:", error.message);
    console.warn("⚠ Server is running but DB-dependent routes will return errors.");
    console.warn("⚠ Set DATABASE_URL in .env and start MongoDB to enable full functionality.");
    return null;
  }
};

module.exports = { connectDB };
