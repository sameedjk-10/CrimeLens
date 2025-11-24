// controllers/agentController.js
import { Op, fn, col, literal } from "sequelize";
import db from "../models/index.js";
const { Crime, User, PoliceAgentRequest, PoliceAgentRequestsTemp, PoliceBranch } = db;

// ===================================================
// ➕ CREATE AGENT REQUEST
// ===================================================
export const agentRequest = async (req, res) => {
  try {
    const { branchId, username, password } = req.body;

    // Validate required fields
    if (!branchId || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validate branch exists
    const branch = await PoliceBranch.findByPk(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" });
    }

    // 1️⃣ Create entry in PoliceAgentRequestsTemp (stores username & password)
    const requestTemp = await PoliceAgentRequestsTemp.create({
      username: username,
      password: password,
      createdAt: new Date(),
    });

    // 2️⃣ Create entry in PoliceAgentRequest (references temp, stores branchId)
    const agentRequest = await PoliceAgentRequest.create({
      policeAgentRequestsTempId: requestTemp.id, // FK to temp table
      userId: null, // Will be set after verification
      branchId: branchId,
      status: "pending", // Default status
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Agent request submitted successfully. Awaiting verification.",
      data: {
        requestId: agentRequest.id,
        tempId: requestTemp.id,
        status: agentRequest.status,
        branchId: agentRequest.branchId,
      },
    });
  } catch (error) {
    console.error("Agent Request Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error submitting agent request" });
  }
};

// ===================================================
// ✅ VERIFY & APPROVE AGENT REQUEST (Admin Only)
// ===================================================
export const verifyAgentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { roleId } = req.body; // roleId for the new agent

    // Find the pending request
    const agentRequest = await PoliceAgentRequest.findByPk(requestId, {
      include: {
        model: PoliceAgentRequestsTemp,
        as: "policeAgentRequestsTemp",
      },
    });

    if (!agentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (agentRequest.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Request has already been processed" });
    }

    // Get temp data
    const tempData = agentRequest.policeAgentRequestsTemp;

    // 1️⃣ Create user in User table with temp credentials
    const newUser = await User.create({
      username: tempData.username,
      passwordHash: tempData.password, // ⚠️ In production, HASH the password
      roleId: roleId || 2, // Default to police officer role
      branchId: agentRequest.branchId,
      createdAt: new Date(),
    });

    // 2️⃣ Update PoliceAgentRequest to link userId and change status
    await agentRequest.update({
      userId: newUser.id,
      status: "approved",
      verifiedAt: new Date(),
    });

    // 3️⃣ Delete the temp entry (no longer needed)
    await tempData.destroy();

    res.status(200).json({
      success: true,
      message: "Agent request approved and user created successfully",
      data: {
        userId: newUser.id,
        username: newUser.username,
        branchId: newUser.branchId,
        status: agentRequest.status,
      },
    });
  } catch (error) {
    console.error("Verify Agent Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying agent request" });
  }
};

// ===================================================
// ❌ REJECT AGENT REQUEST (Admin Only)
// ===================================================
export const rejectAgentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    const agentRequest = await PoliceAgentRequest.findByPk(requestId, {
      include: {
        model: PoliceAgentRequestsTemp,
        as: "policeAgentRequestsTemp",
      },
    });

    if (!agentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Update status and add rejection reason
    await agentRequest.update({
      status: "rejected",
      rejectionReason: reason,
      verifiedAt: new Date(),
    });

    // Delete temp entry
    await agentRequest.policeAgentRequestsTemp.destroy();

    res.status(200).json({
      success: true,
      message: "Agent request rejected",
      data: { requestId: agentRequest.id, status: agentRequest.status },
    });
  } catch (error) {
    console.error("Reject Agent Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error rejecting agent request" });
  }
};

// ===================================================
// 📋 GET ALL PENDING AGENT REQUESTS (Admin Only)
// ===================================================
export const getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await PoliceAgentRequest.findAll({
      where: { status: "pending" },
      include: [
        {
          model: PoliceAgentRequestsTemp,
          as: "policeAgentRequestsTemp",
          attributes: ["id", "username", "createdAt"],
        },
        {
          model: PoliceBranch,
          as: "branch",
          attributes: ["id", "branchName"],
        },
      ],
    });

    res.status(200).json({ success: true, data: pendingRequests });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching requests" });
  }
};

// ===================================================
// 🔍 GET REQUEST BY ID
// ===================================================
export const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const agentRequest = await PoliceAgentRequest.findByPk(requestId, {
      include: [
        {
          model: PoliceAgentRequestsTemp,
          as: "policeAgentRequestsTemp",
        },
        {
          model: PoliceBranch,
          as: "branch",
        },
      ],
    });

    if (!agentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, data: agentRequest });
  } catch (error) {
    console.error("Fetch Request Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching request" });
  }
};