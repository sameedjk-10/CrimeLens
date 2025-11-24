import express from "express";
import {
  agentRequest,
  verifyAgentRequest,
  rejectAgentRequest,
  getPendingRequests,
  getRequestById,
} from "../controllers/agentController.js";

const router = express.Router();

// Public routes
router.post("/request", agentRequest);

// Admin-only routes (you can add auth middleware later)
router.post("/verify/:requestId", verifyAgentRequest);
router.post("/reject/:requestId", rejectAgentRequest);
router.get("/pending", getPendingRequests);
router.get("/:requestId", getRequestById);

export default router;