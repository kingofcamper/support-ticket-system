const express = require("express");
const { connectDB, sequelize } = require("../config/database");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const User = require("./models/User");
const Ticket = require("./models/Ticket");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB();

// Sync models
sequelize
  .sync({ alter: true }) // alter:true updates DB if models change (safe for development)
  .then(() => console.log("✅ Models synchronized with database."))
  .catch((err) => console.error("❌ Error syncing models:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
