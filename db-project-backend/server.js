import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import agentRoutes from "./routes/agentRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/index.js"; // Import centralized model loader
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // <-- your frontend URL
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/stats", statsRoutes);


// Destructure sequelize from db
const { sequelize } = db;

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ✅ Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection established with Supabase.");

    // ✅ Sync all tables
    // await sequelize.sync({ alter: true });
    // console.log("✅ All tables synchronized successfully!");

    // ✅ Start the server only after successful DB setup
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    process.exit(1); // Exit process on DB connection failure
  }
};

// Run the async startup
startServer();


// in app.js or routes/index.js
import zonesRoutes from "./routes/zoneRoutes.js";
app.use("/api/zones", zonesRoutes);

import crimeRoutes from "./routes/crimeRoutes.js";
app.use("/api/crimes", crimeRoutes);

// ✅ Handle any unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
  process.exit(1);
});
