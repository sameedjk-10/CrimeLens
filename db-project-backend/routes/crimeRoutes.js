// routes/crimeRoutes.js
import express from "express";
import { getCrimeById, getAllCrimeTypes, getAllCrimes, getCrimesForMap, searchCrimes, addCrime, updateCrime, deleteCrime, } from "../controllers/CrimeControllers.js";

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
// router.get(
//   "/search",
//   // verifyToken,
//   // authorizeRoles("admin", "police", "public"),
//   searchCrimes
// );

// ➕ Add new crime (admin + police)
router.post(
  "/add",
  // verifyToken,
  // authorizeRoles("admin", "police"),
  addCrime
);

// GET full details of a single crime
router.get("/get-crime/:id", getCrimeById);

// UPDATE crime
router.put("/update/:id", updateCrime);


// ✏️ Update crime (admin + police)
// router.put(
//   "/:id",
//   // verifyToken,
//   // authorizeRoles("admin", "police"),
//   updateCrime
// );

// ❌ Delete crime (only admin)
router.delete(
  "/delete/:id",
  // verifyToken,
  // authorizeRoles("admin"),
  deleteCrime
);

export default router;
