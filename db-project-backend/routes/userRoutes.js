import express from "express";
import {
  // searchCrimes,
  reportCrime,
  getPendingSubmissions,
  approveCrimeReport,
  rejectCrimeReport,
  updateCrime,
  deleteCrime,
} from "../controllers/CrimeControllers.js";

const router = express.Router();

// Crime Reporting (Public)
router.post("/report-crime", reportCrime);

// Crime Searching
// router.get("/search", searchCrimes);

// Crime Verification (Police Officer)
router.get("/pending", getPendingSubmissions);
router.post("/approve/:submissionId", approveCrimeReport);
router.post("/reject/:submissionId", rejectCrimeReport);

// Crime Management (Admin/Police)
router.put("/update/:id", updateCrime);
router.delete("/delete/:id", deleteCrime);

export default router;