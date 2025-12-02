// controllers/agentController.js
// import { v4 as uuidv4 } from "uuid";
import { QueryTypes, Op, fn, col, literal } from "sequelize";
import sequelize from "../config/db.js";
import db from "../models/index.js";
const { Crime, User, Criminal , CrimeSubmission, PoliceAgentRequestsTemp, CrimeReportsSubmitter, PoliceAgentRequest, CrimeType, Zone, PoliceBranch } = db;

// import { Request, Response } from "express";

// ===================================================
// ➕ CREATE AGENT REQUEST
// ===================================================
// export const agentRequest = async (req, res) => {
//   try {
//     const { branchId, username, password } = req.body;

//     // Validate required fields
//     if (!branchId || !username || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     // Validate branch exists
//     const branch = await PoliceBranch.findByPk(branchId);
//     if (!branch) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Branch not found" });
//     }

//     // Check if username already exists
//     const existingUser = await User.findOne({ where: { username } });
//     if (existingUser) {
//       return res
//         .status(409)
//         .json({ success: false, message: "Username already exists" });
//     }

//     // 1️⃣ Create entry in PoliceAgentRequestsTemp (stores username & password)
//     const requestTemp = await PoliceAgentRequestsTemp.create({
//       username: username,
//       password: password,
//       createdAt: new Date(),
//     });

//     // 2️⃣ Create entry in PoliceAgentRequest (references temp, stores branchId)
//     const agentRequest = await PoliceAgentRequest.create({
//       policeAgentRequestsTempId: requestTemp.id, // FK to temp table
//       userId: null, // Will be set after verification
//       branchId: branchId,
//       status: "pending", // Default status
//       createdAt: new Date(),
//     });

//     res.status(201).json({
//       success: true,
//       message: "Agent request submitted successfully. Awaiting verification.",
//       data: {
//         requestId: agentRequest.id,
//         tempId: requestTemp.id,
//         status: agentRequest.status,
//         branchId: agentRequest.branchId,
//       },
//     });
//   } catch (error) {
//     console.error("Agent Request Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error submitting agent request" });
//   }
// };

// import { sequelize } from "../models/index.js";
// import { QueryTypes } from "sequelize";

export const agentRequest = async (req, res) => {
  try {
    const { branchId, username, password } = req.body;

    // Validate required fields
    if (!branchId || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // 1️⃣ Validate branch exists (PoliceBranch)
    // Assuming table name = "PoliceBranch" and PK = "id"  ⚠ verify
    const branch = await sequelize.query(
      `
      SELECT * FROM "PoliceBranch" WHERE id = :branchId
      `,
      {
        replacements: { branchId },
        type: QueryTypes.SELECT,
      }
    );

    if (branch.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    // 2️⃣ Check if username already exists (User table)
    const existingUser = await sequelize.query(
      `
      SELECT * FROM "User" WHERE username = :username
      `,
      {
        replacements: { username },
        type: QueryTypes.SELECT,
      }
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" });
    }

    // 3️⃣ Insert into PoliceAgentRequestsTemp
    // Table name = "PoliceAgentRequestsTemp"  ⚠ verify
    const requestTempResult = await sequelize.query(
      `
      INSERT INTO "PoliceAgentRequestsTemp" (username, password, "createdAt")
      VALUES (:username, :password, :createdAt)
      RETURNING id;
      `,
      {
        replacements: {
          username,
          password,
          createdAt: new Date(),
        },
        type: QueryTypes.INSERT,
      }
    );

    // The returned INSERT format is: [ [ { id: X } ], metadata ]
    const requestTempId = requestTempResult[0][0].id;

    // 4️⃣ Insert into PoliceAgentRequest
    // Table name = "PoliceAgentRequest"  ⚠ verify
    const agentRequestResult = await sequelize.query(
      `
      INSERT INTO "PoliceAgentRequest" 
      ("policeAgentRequestsTempId", "userId", "branchId", status, "createdAt")
      VALUES (:tempId, NULL, :branchId, 'pending', :createdAt)
      RETURNING id, status, "branchId";
      `,
      {
        replacements: {
          tempId: requestTempId,
          branchId,
          createdAt: new Date(),
        },
        type: QueryTypes.INSERT,
      }
    );

    const requestData = agentRequestResult[0][0];

    // 5️⃣ Send same structure back to frontend (DO NOT CHANGE ANY FIELDS)
    res.status(201).json({
      success: true,
      message:
        "Agent request submitted successfully. Awaiting verification.",
      data: {
        requestId: requestData.id,
        tempId: requestTempId,
        status: requestData.status,
        branchId: requestData.branchId,
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
// export const verifyAgentRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const { roleId } = req.body; // roleId for the new agent

//     // Find the pending request
//     const agentRequest = await PoliceAgentRequest.findByPk(requestId, {
//       include: {
//         model: PoliceAgentRequestsTemp,
//         // as: "PoliceAgentRequestsTemp",
//       },
//     });

//     if (!agentRequest) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Request not found" });
//     }

//     if (agentRequest.status !== "pending") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Request has already been processed" });
//     }

//     // Get temp data
//     const tempData = agentRequest.PoliceAgentRequestsTemp;

//     // 1️⃣ Create user in User table with temp credentials
//     const newUser = await User.create({
//       // id: uuidv4(),
//       username: tempData.username,
//       passwordHash: tempData.password, // ⚠️ In production, HASH the password
//       roleId: roleId || 2, // Default to police officer role
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     // 2️⃣ Update PoliceAgentRequest to link userId and change status
//     await agentRequest.update({
//       userId: newUser.id,
//       status: "approved",
//       verifiedAt: new Date(),
//     });

//     // 3️⃣ Delete the temp entry (no longer needed)
//     await tempData.destroy();

//     res.status(200).json({
//       success: true,
//       message: "Agent request approved and user created successfully",
//       data: {
//         userId: newUser.id,
//         username: newUser.username,
//         branchId: newUser.branchId,
//         status: agentRequest.status,
//       },
//     });
//   } catch (error) {
//     console.error("Verify Agent Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error verifying agent request" });
//   }
// };


export const verifyAgentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { roleId } = req.body; // roleId for the new agent

    // ---------------------------
    // 1️⃣ Fetch pending agent request + temp data
    // ---------------------------
    const agentRequestRows = await sequelize.query(
      `
      SELECT ar.id AS "agentRequestId",
             ar."userId",
             ar."branchId",
             ar.status,
             t.id AS "tempId",
             t.username,
             t.password
      FROM "PoliceAgentRequest" ar
      JOIN "PoliceAgentRequestsTemp" t
        ON t.id = ar."policeAgentRequestsTempId"
      WHERE ar.id = :requestId
      LIMIT 1;
      `,
      {
        replacements: { requestId },
        type: QueryTypes.SELECT,
      }
    );

    const agentRequest = agentRequestRows[0];

    if (!agentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (agentRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // ---------------------------
    // 2️⃣ Create new user in User table
    // ---------------------------
    const now = new Date();

    const newUserResult = await sequelize.query(
      `
      INSERT INTO "User" (username, "passwordHash", "roleId", "createdAt", "updatedAt")
      VALUES (:username, :passwordHash, :roleId, :createdAt, :updatedAt)
      RETURNING id, username, "roleId";  -- ⚠ returning fields used in response
      `,
      {
        replacements: {
          username: agentRequest.username,
          passwordHash: agentRequest.password, // ⚠ in production, hash password
          roleId: roleId || 2,
          createdAt: now,
          updatedAt: now,
        },
        type: QueryTypes.INSERT,
      }
    );

    const newUser = newUserResult[0][0];

    // ---------------------------
    // 3️⃣ Update PoliceAgentRequest to link new user and change status
    // ---------------------------
    await sequelize.query(
      `
      UPDATE "PoliceAgentRequest"
      SET "userId" = :userId,
          status = 'approved'
      WHERE id = :requestId
      `,
      {
        replacements: {
          userId: newUser.id,
          verifiedAt: now,
          requestId,
        },
        type: QueryTypes.UPDATE,
      }
    );

    // ---------------------------
    // 4️⃣ Delete temp entry
    // ---------------------------
    await sequelize.query(
      `
      DELETE FROM "PoliceAgentRequestsTemp"
      WHERE id = :tempId
      `,
      {
        replacements: { tempId: agentRequest.tempId },
        type: QueryTypes.DELETE,
      }
    );

    // ---------------------------
    // 5️⃣ Send response (frontend format unchanged)
    // ---------------------------
    res.status(200).json({
      success: true,
      message: "Agent request approved and user created successfully",
      data: {
        userId: newUser.id,
        username: newUser.username,
        branchId: agentRequest.branchId,
        status: "approved",
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
// export const rejectAgentRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const { reason } = req.body;

//     const agentRequest = await PoliceAgentRequest.findByPk(requestId, {
//       include: {
//         model: PoliceAgentRequestsTemp,
//         // as: "policeAgentRequestsTemp",
//       },
//     });

//     if (!agentRequest) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Request not found" });
//     }

//     // Update status and add rejection reason
//     await agentRequest.update({
//       status: "rejected",
//       rejectionReason: reason,
//       verifiedAt: new Date(),
//     });

//     // Delete temp entry
//     await agentRequest.PoliceAgentRequestsTemp.destroy();

//     res.status(200).json({
//       success: true,
//       message: "Agent request rejected",
//       data: { requestId: agentRequest.id, status: agentRequest.status },
//     });
//   } catch (error) {
//     console.error("Reject Agent Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error rejecting agent request" });
//   }
// };

export const rejectAgentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    // const { reason } = req.body;

    // ---------------------------
    // 1️⃣ Fetch agent request + temp entry
    // ---------------------------
    const agentRequestRows = await sequelize.query(
      `
      SELECT ar.id AS "agentRequestId",
             ar.status,
             t.id AS "tempId"
      FROM "PoliceAgentRequest" ar
      JOIN "PoliceAgentRequestsTemp" t
        ON t.id = ar."policeAgentRequestsTempId"
      WHERE ar.id = :requestId
      LIMIT 1;
      `,
      {
        replacements: { requestId },
        type: QueryTypes.SELECT,
      }
    );

    const agentRequest = agentRequestRows[0];

    if (!agentRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // ---------------------------
    // 2️⃣ Update status and add rejection reason
    // ---------------------------
    const now = new Date();
    await sequelize.query(
      `
      UPDATE "PoliceAgentRequest"
      SET status = 'rejected'
      WHERE id = :requestId
      `,
      {
        replacements: {
          reason,
          verifiedAt: now,
          requestId,
        },
        type: QueryTypes.UPDATE,
      }
    );

    // ---------------------------
    // 3️⃣ Delete temp entry
    // ---------------------------
    await sequelize.query(
      `
      DELETE FROM "PoliceAgentRequestsTemp"
      WHERE id = :tempId
      `,
      {
        replacements: { tempId: agentRequest.tempId },
        type: QueryTypes.DELETE,
      }
    );

    // ---------------------------
    // 4️⃣ Response (frontend format unchanged)
    // ---------------------------
    res.status(200).json({
      success: true,
      message: "Agent request rejected",
      data: { requestId: agentRequest.agentRequestId, status: "rejected" },
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
// export const getPendingRequests = async (req, res) => {
//   try {
//     const pendingRequests = await PoliceAgentRequest.findAll({
//       where: { status: "pending" },
//       include: [
//         {
//           model: PoliceAgentRequestsTemp,
//           attributes: ["id", "username", "password", "createdAt"],
//         },
//         {
//           model: PoliceBranch,
//           attributes: ["id", "name", "contactNumber"],
//         },
//       ],
//     });

//     res.status(200).json({ success: true, data: pendingRequests });
//   } catch (error) {
//     console.error("Fetch Requests Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching requests" });
//   }
// };

// ===================================================
// 🔍 GET REQUEST BY ID
// ===================================================
// export const getRequestById = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const agentRequest = await PoliceAgentRequest.findByPk(requestId, {
//       include: [
//         {
//           model: PoliceAgentRequestsTemp,
//           // as: "policeAgentRequestsTemp",
//         },
//         {
//           model: PoliceBranch,
//           // as: "branch",
//         },
//       ],
//     });

//     if (!agentRequest) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Request not found" });
//     }

//     res.status(200).json({ success: true, data: agentRequest });
//   } catch (error) {
//     console.error("Fetch Request Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching request" });
//   }
// };

// ===================================================
// 🔹 GET ALL PENDING REQUESTS
// ===================================================
export const getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await sequelize.query(
      `
      SELECT 
        ar.id AS "agentRequestId",
        ar.status,
        ar."userId",
        ar."branchId",

        t.id AS "tempId",
        t.username AS "tempUsername",
        t.password AS "tempPassword",
        t."createdAt" AS "tempCreatedAt",

        b.id AS "branchId",
        b.name AS "branchName",
        b."contactNumber" AS "branchContactNumber"
      FROM "PoliceAgentRequest" ar
      JOIN "PoliceAgentRequestsTemp" t
        ON t.id = ar."policeAgentRequestsTempId"
      JOIN "PoliceBranch" b
        ON b.id = ar."branchId"
      WHERE ar.status = 'pending'
      ORDER BY ar.id ASC;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Reshape to mimic Sequelize include format
    const formattedRequests = pendingRequests.map(r => ({
      id: r.agentRequestId,
      status: r.status,
      userId: r.userId,
      branchId: r.branchId,

      PoliceAgentRequestsTemp: {
        id: r.tempId,
        username: r.tempUsername,
        password: r.tempPassword,
        createdAt: r.tempCreatedAt,
      },
      PoliceBranch: {
        id: r.branchId,
        name: r.branchName,
        contactNumber: r.branchContactNumber,
      },
    }));

    res.status(200).json({ success: true, data: formattedRequests });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching requests" });
  }
};

// ===================================================
// 🔹 GET REQUEST BY ID
// ===================================================
export const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const requestRows = await sequelize.query(
      `
      SELECT 
        ar.id AS "agentRequestId",
        ar.status,
        ar."userId",
        ar."branchId",

        t.id AS "tempId",
        t.username AS "tempUsername",
        t.password AS "tempPassword",
        t."createdAt" AS "tempCreatedAt",

        b.id AS "branchId",
        b.name AS "branchName",
        b."contactNumber" AS "branchContactNumber"
      FROM "PoliceAgentRequest" ar
      JOIN "PoliceAgentRequestsTemp" t
        ON t.id = ar."policeAgentRequestsTempId"
      JOIN "PoliceBranch" b
        ON b.id = ar."branchId"
      WHERE ar.id = :requestId
      LIMIT 1;
      `,
      {
        replacements: { requestId },
        type: QueryTypes.SELECT,
      }
    );

    const r = requestRows[0];

    if (!r) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Reshape like Sequelize include
    const formattedRequest = {
      id: r.agentRequestId,
      status: r.status,
      userId: r.userId,
      branchId: r.branchId,
      PoliceAgentRequestsTemp: {
        id: r.tempId,
        username: r.tempUsername,
        password: r.tempPassword,
        createdAt: r.tempCreatedAt,
      },
      PoliceBranch: {
        id: r.branchId,
        name: r.branchName,
        contactNumber: r.branchContactNumber,
      },
    };

    res.status(200).json({ success: true, data: formattedRequest });
  } catch (error) {
    console.error("Fetch Request Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching request" });
  }
};



export const getAllAgents = async (req, res) => {
  try {
    const agents = await sequelize.query(
      `
      SELECT 
        par.id AS "agentId",
        par."branchId" AS "branchId",
        u.username AS "username",
        u."passwordHash" AS "password",
        pb."contactNumber" AS "branchContact",
        par."createdAt" AS "createdAt"
      FROM "PoliceAgentRequest" par
      LEFT JOIN "User" u ON u.id = par."userId"
      LEFT JOIN "PoliceBranch" pb ON pb.id = par."branchId"
      WHERE par.status = 'approved'
      ORDER BY par.id ASC;
      `,
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (err) {
    console.error("Error fetching agents:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// export const updateAgent = async (req, res) => {
//   const agentId = req.params.id;
//   const { username, password, branchId } = req.body;

//   const t = await sequelize.transaction();

//   try {
//     // Find the agent
//     const agent = await PoliceAgentRequest.findByPk(agentId, { transaction: t });
//     if (!agent) {
//       await t.rollback();
//       return res.status(404).json({ success: false, message: "Agent not found" });
//     }

//     // Update branchId in PoliceAgentRequest
//     agent.branchId = branchId ?? agent.branchId;
//     await agent.save({ transaction: t });

//     // Update username/password in User table
//     const user = await User.findByPk(agent.userId, { transaction: t });
//     if (!user) {
//       await t.rollback();
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (username) user.username = username;
//     if (password) user.passwordHash = password; // ideally hash password in real app
//     await user.save({ transaction: t });

//     await t.commit();
//     return res.json({ success: true, message: "Agent updated successfully" });
//   } catch (err) {
//     await t.rollback();
//     console.error("Error updating agent:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// ----------------- DELETE AGENT -----------------

export const updateAgent = async (req, res) => {
  const agentId = req.params.id;
  const { username, password, branchId } = req.body;

  const t = await sequelize.transaction();

  try {
    // ---------------------------
    // 1️⃣ Fetch agent
    // ---------------------------
    const agentRows = await sequelize.query(
      `
      SELECT id, "userId", "branchId"
      FROM "PoliceAgentRequest"
      WHERE id = :agentId
      LIMIT 1
      FOR UPDATE;
      `,
      {
        replacements: { agentId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    const agent = agentRows[0];

    if (!agent) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    // ---------------------------
    // 2️⃣ Update branchId in PoliceAgentRequest
    // ---------------------------
    await sequelize.query(
      `
      UPDATE "PoliceAgentRequest"
      SET "branchId" = :branchId
      WHERE id = :agentId
      `,
      {
        replacements: {
          branchId: branchId ?? agent.branchId,
          agentId,
        },
        type: QueryTypes.UPDATE,
        transaction: t,
      }
    );

    // ---------------------------
    // 3️⃣ Fetch user
    // ---------------------------
    const userRows = await sequelize.query(
      `
      SELECT id, username, "passwordHash"
      FROM "User"
      WHERE id = :userId
      LIMIT 1
      FOR UPDATE;
      `,
      {
        replacements: { userId: agent.userId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    const user = userRows[0];

    if (!user) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ---------------------------
    // 4️⃣ Update username/password in User
    // ---------------------------
    const updatedUsername = username ?? user.username;
    const updatedPassword = password ?? user.passwordHash;

    await sequelize.query(
      `
      UPDATE "User"
      SET username = :username,
          "passwordHash" = :passwordHash
      WHERE id = :userId
      `,
      {
        replacements: {
          username: updatedUsername,
          passwordHash: updatedPassword,
          userId: user.id,
        },
        type: QueryTypes.UPDATE,
        transaction: t,
      }
    );

    // ---------------------------
    // 5️⃣ Commit transaction
    // ---------------------------
    await t.commit();

    return res.json({ success: true, message: "Agent updated successfully" });
  } catch (err) {
    await t.rollback();
    console.error("Error updating agent:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// export const deleteAgent = async (req, res) => {
//   const agentId = req.params.id;

//   try {
//     // Find the agent first
//     const agent = await PoliceAgentRequest.findByPk(agentId);
//     if (!agent) {
//       return res.status(404).json({ success: false, message: "Agent not found" });
//     }

//     // Get the userId from the agent record BEFORE deletion
//     const userId = agent.userId;

//     // Delete the agent record
//     await agent.destroy();

//     // Delete the associated user record if userId exists
//     if (userId) {
//       await User.destroy({ where: { id: userId } });
//     }

//     return res.json({ success: true, message: "Agent and associated user deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting agent:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const deleteAgent = async (req, res) => {
  const agentId = req.params.id;

  try {
    // ---------------------------
    // 1️⃣ Fetch agent
    // ---------------------------
    const agentRows = await sequelize.query(
      `
      SELECT id, "userId"
      FROM "PoliceAgentRequest"
      WHERE id = :agentId
      LIMIT 1;
      `,
      {
        replacements: { agentId },
        type: QueryTypes.SELECT,
      }
    );

    const agent = agentRows[0];

    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    const userId = agent.userId;

    // ---------------------------
    // 2️⃣ Delete agent record
    // ---------------------------
    await sequelize.query(
      `
      DELETE FROM "PoliceAgentRequest"
      WHERE id = :agentId
      `,
      {
        replacements: { agentId },
        type: QueryTypes.DELETE,
      }
    );

    // ---------------------------
    // 3️⃣ Delete associated user if exists
    // ---------------------------
    if (userId) {
      await sequelize.query(
        `
        DELETE FROM "User"
        WHERE id = :userId
        `,
        {
          replacements: { userId },
          type: QueryTypes.DELETE,
        }
      );
    }

    // ---------------------------
    // 4️⃣ Response
    // ---------------------------
    return res.json({
      success: true,
      message: "Agent and associated user deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting agent:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
