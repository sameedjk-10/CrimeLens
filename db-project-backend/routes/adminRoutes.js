// routes/adminRoutes.js
import express from "express";
import { uploadCrimesCSV } from "../controllers/adminController.js";
import { upload } from "../config/multerConfig.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/admin/upload-crimes
// 'file' is the form field name from frontend
router.post(
  "/upload-crimes",
  verifyToken,
  authorizeRoles("Admin"),
  upload.single("file"),
  uploadCrimesCSV
);


export default router;
