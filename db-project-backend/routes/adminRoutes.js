// routes/adminRoutes.js
import express from "express";
import { uploadCrimesCSV } from "../controllers/adminControls/UploadControllers.js";
import { upload } from "../config/multerConfig.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

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
