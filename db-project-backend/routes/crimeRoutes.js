// routes/crimeRoutes.js
import express from "express";
import { getAllCrimeTypes, getAllCrimes, getCrimesForMap, searchCrimes, addCrime, updateCrime, deleteCrime, } from "../controllers/CrimeControllers.js";

const router = express.Router();

router.get(
  "/",
  getCrimesForMap
);

router.get(
  "/all",
  getAllCrimes
);

router.get(
  "/types",
  getAllCrimeTypes
);

// 🔍 Search Crimes (everyone, but filtered in controller)
router.get(
  "/search",
  // verifyToken,
  // authorizeRoles("admin", "police", "public"),
  searchCrimes
);

// ➕ Add new crime (admin + police)
router.post(
  "/add",
  // verifyToken,
  // authorizeRoles("admin", "police"),
  addCrime
);

// ✏️ Update crime (admin + police)
router.put(
  "/update/:id",
  // verifyToken,
  // authorizeRoles("admin", "police"),
  updateCrime
);

// ❌ Delete crime (only admin)
router.delete(
  "/delete/:id",
  // verifyToken,
  // authorizeRoles("admin"),
  deleteCrime
);

export default router;
