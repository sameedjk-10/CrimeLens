// routes/crimeRoutes.js
import express from "express";
import {
  searchCrimes,
  addCrime,
  updateCrime,
  deleteCrime,
} from "../controllers/crimeController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔍 Search Crimes (everyone, but filtered in controller)
router.get(
  "/search",
  verifyToken,
  authorizeRoles("admin", "police", "public"),
  searchCrimes
);

// ➕ Add new crime (admin + police)
router.post(
  "/add",
  verifyToken,
  authorizeRoles("admin", "police"),
  addCrime
);

// ✏️ Update crime (admin + police)
router.put(
  "/update/:id",
  verifyToken,
  authorizeRoles("admin", "police"),
  updateCrime
);

// ❌ Delete crime (only admin)
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteCrime
);

export default router;
