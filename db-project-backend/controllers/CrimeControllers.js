// controllers/crimeController.js
import { Op, fn, col, literal } from "sequelize";
import db from "../models/index.js";
const { Crime, User, Criminal , CrimeSubmission, CrimeReportsSubmitter, CrimeType, Zone, PoliceBranch } = db;

// ===================================================
// 🌍 GET CRIMES FOR MAP (GeoJSON)
// ===================================================
export const getCrimesForMap = async (req, res) => {
  try {
    const { mode, crimeType, zoneId, startDate, endDate, lat, lng, radius } = req.query;

    // Base SQL with join to CrimeType to get name
    let sql = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.address,
        c."zoneId",
        z.name AS "zoneName",
        c."crimeTypeId",
        ct.name AS "crimeTypeName",
        c.status,
        c."incidentDate",
        ST_AsGeoJSON(c.location)::json AS geom
      FROM "Crime" c
      JOIN "CrimeType" ct ON c."crimeTypeId" = ct.id
      LEFT JOIN "Zone" z ON c."zoneId" = z.id
    `;

    const conditions = [];
    const replacements = {}; // For parameterized query

    // Filter: crime type by name (case-insensitive)
    if (crimeType && crimeType !== "All") {
      conditions.push(`ct.name ILIKE :crimeType`);
      replacements.crimeType = crimeType;
    }

    // Filter: zone
    if (zoneId && zoneId !== "All") {
      conditions.push(`c."zoneId" = :zoneId`);
      replacements.zoneId = zoneId;
    }

    // Filter: date range
    if (startDate) {
      conditions.push(`c."incidentDate" >= :startDate`);
      replacements.startDate = new Date(startDate).toISOString();
    }
    if (endDate) {
      conditions.push(`c."incidentDate" <= :endDate`);
      replacements.endDate = new Date(endDate).toISOString();
    }

    // Radius mode
    if (mode === "radius" && lat && lng && radius) {
      conditions.push(`
        ST_DWithin(
          c.location::geography,
          ST_SetSRID(ST_Point(:lng, :lat), 4326),
          :radius
        )
      `);
      replacements.lat = parseFloat(lat);
      replacements.lng = parseFloat(lng);
      replacements.radius = parseFloat(radius);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += ";";

    const crimes = await db.sequelize.query(sql, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements, // safely pass parameters
    });

    const formatted = crimes
      .map((c) => {
        if (!c.geom) return null; // skip crimes without location
        const loc = typeof c.geom === "string" ? JSON.parse(c.geom) : c.geom;
        return {
          id: c.id,
          crimeTypeId: c.crimeTypeId,
          crimeTypeName: c.crimeTypeName,
          incidentDate: c.incidentDate,
          status: c.status,
          latitude: loc.coordinates[1],
          longitude: loc.coordinates[0],
          title: c.title,
          description: c.description,
          address: c.address,
          zoneId: c.zoneId,
          zoneName: c.zoneName,
        };
      })
      .filter(Boolean); // remove nulls

    return res.json(formatted);
  } catch (err) {
    console.error("Map Crime Error:", err);
    res.status(500).json([]);
  }
};

export const getAllCrimeTypes = async (req, res) => {
  try {
    const crimeTypes = await db.CrimeType.findAll({
      attributes: ["id", "name"], // only id and name
      order: [["name", "ASC"]],
    });

    res.json(crimeTypes);
  } catch (err) {
    console.error("Error fetching crime types:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===================================================
// ➕ SUBMIT CRIME REPORT
// ===================================================
export const addCrime = async (req, res) => {
    try {
        const { title, description, crime_type_id, date, location, address, zone_id } = req.body;

        if (!title || !crime_type_id || !date || !location) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // location should be in format: { lat: xx.xx, lng: yy.yy }
        const { lat, lng } = location;
        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: "Invalid location format" });
        }

        const newCrime = await Crime.create({
            title,
            description,
            crime_type_id,
            date,
            address,
            zone_id,
            status: "pending",
            location: literal(`ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)`),
        });

        res.status(201).json({ success: true, message: "Crime added successfully", data: newCrime });
    } catch (error) {
        console.error("Add Crime Error:", error);
        res.status(500).json({ success: false, message: "Error adding crime" });
    }
};

// ===================================================
// 📋 GET ALL PENDING CRIME SUBMISSIONS
// ===================================================
export const getPendingSubmissions = async (req, res) => {
  try {
    const pendingSubmissions = await CrimeSubmission.findAll({
      where: { status: "pending" },
      include: [
        {
          model: CrimeReportsSubmitter,
          attributes: ["submitterCnic", "submitterName", "submitterContact"],
        },
        {
          model: CrimeType,
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Zone,
          attributes: ["id"],
          required: false,
        },
      ],
    });

    res.status(200).json({ success: true, data: pendingSubmissions });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching submissions" });
  }
};

// ===================================================
// ✅ VERIFY & APPROVE CRIME REPORT (Police Agent)
// ===================================================
export const approveCrimeReport = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Now receiving LAT & LNG separately
    const { address, latitude, longitude } = req.body;

    // Find submission
    const submission = await CrimeSubmission.findByPk(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Crime submission not found",
      });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Submission already processed",
      });
    }

    // Prepare Base Crime Data
    let crimeData = {
      title: submission.description.substring(0, 100),
      description: submission.description,
      crimeTypeId: submission.crimeTypeId,
      incidentDate: submission.incidentDate,
      address: address,
      zoneId: submission.zoneId,
      status: "approved",
    };

    // Add geometry only if lat & lng exist
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      crimeData.location = literal(
        `ST_SetSRID(ST_Point(${Number(longitude)}, ${Number(latitude)}), 4326)`
      );
    }

    // Save Crime
    const verifiedCrime = await Crime.create(crimeData);

    // Update Submission
    await submission.update({
      status: "approved",
      verifiedCrimeId: verifiedCrime.id,
      verifiedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Crime report approved and verified",
      data: {
        submissionId: submission.id,
        crimeId: verifiedCrime.id,
        status: submission.status,
      },
    });
  } catch (error) {
    console.error("Approve Crime Error:", error);
    res.status(500).json({
      success: false,
      message: "Error approving crime report",
    });
  }
};

// ===================================================
// ❌ REJECT CRIME REPORT (Police Agent)
// ===================================================
export const rejectCrimeReport = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { reason } = req.body;

    const submission = await CrimeSubmission.findByPk(submissionId);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Crime submission not found" });
    }

    // Update submission status
    await submission.update({
      status: "rejected",
      rejectionReason: reason,
      verifiedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Crime report rejected",
      data: { submissionId: submission.id, status: submission.status },
    });
  } catch (error) {
    console.error("Reject Crime Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error rejecting crime report" });
  }
};

// ===================================================
//  SUBMIT A CRIME REPORT
// ===================================================

export const reportCrime = async (req, res) => {
  try {
    const {
      fullName,
      cnic,
      contact,
      zone,
      crimeTypeId,
      date,
      address,
      description,
    } = req.body;

    if (!cnic || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // 1️⃣ Check if submitter exists, if not create new record
    let submitterRecord = await CrimeReportsSubmitter.findByPk(cnic);
    
    if (!submitterRecord) {
      submitterRecord = await CrimeReportsSubmitter.create({
        submitterCnic: cnic,
        submitterName: fullName,
        submitterContact: contact,
      });
    } else {
      // Optional: Update existing submitter's info if provided
      if (fullName || contact) {
        await submitterRecord.update({
          ...(fullName && { submitterName: fullName }),
          ...(contact && { submitterContact: contact }),
        });
      }
    }

    // 2️⃣ Create crime submission (pending status)
    const newCrime = await CrimeSubmission.create({
      submitterCnic: cnic,
      zoneId: zone,
      incidentDate: date,
      description: description,
      status: "pending",
      crimeTypeId: crimeTypeId,
      address: address,
    });

    res.status(201).json({
      success: true,
      message: "Crime report submitted successfully",
      data: newCrime,
    });
  } catch (error) {
    console.error("Add Crime Error:", error);
    res.status(500).json({ success: false, message: "Error adding crime" });
  }
};


// ===================================================
// 📌 GET ALL CRIMES (For Records Table)
// ===================================================
import { Sequelize } from "sequelize";

export const getAllCrimes = async (req, res) => {
  try {
    const crimes = await Crime.findAll({
      attributes: [
        "id",
        "incidentDate",
        // Zone Name
        [
          Sequelize.literal(`(
            SELECT "name" FROM "Zone" AS z
            WHERE z.id = "Crime"."zoneId"
            LIMIT 1
          )`),
          "zoneName"
        ],
        // Registered Branch ID
        [
          Sequelize.literal(`(
            SELECT "id" FROM "PoliceBranch" AS pb
            WHERE pb."zoneId" = "Crime"."zoneId"
            LIMIT 1
          )`),
          "registeredBranchId"
        ],
        // Submitter CNIC
        [
          Sequelize.literal(`(
            SELECT "submitterCnic" FROM "CrimeSubmission" AS cs
            WHERE cs."verifiedCrimeId" = "Crime"."id"
            LIMIT 1
          )`),
          "submitterCnic"
        ],
        // Crime Type Name
        [
          Sequelize.literal(`(
            SELECT "name" FROM "CrimeType" AS ct
            WHERE ct.id = "Crime"."crimeTypeId"
            LIMIT 1
          )`),
          "crimeTypeName"
        ]
      ],
      order: [["incidentDate", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      data: crimes
    });

  } catch (error) {
    console.error("❌ Error fetching crimes:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching crime records",
    });
  }
};

// --------------------------------------------------
// GET SINGLE CRIME BY ID
// --------------------------------------------------
export const getCrimeById = async (req, res) => {
  try {
    const { id } = req.params;

    const crime = await Crime.findOne({
      where: { id },
      attributes: [
        "id",
        "title",
        "description",
        "crimeTypeId",
        "incidentDate",
        "status",
        "address",
        "zoneId",
        "location"
      ]
    });

    if (!crime) {
      return res.status(404).json({ success: false, message: "Crime not found" });
    }

    res.json({ success: true, data: crime });
  } catch (err) {
    console.error("Error fetching crime:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// UPDATE CRIME
// --------------------------------------------------
export const updateCrime = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      address,
      zoneId,
      latitude,
      longitude
    } = req.body;

    const crime = await Crime.findByPk(id);
    if (!crime) {
      return res.status(404).json({ success: false, message: "Crime not found" });
    }

    // Build base update object
    const updatedData = {
      title,
      description,
      address,
      zoneId: zoneId || null,
    };

    // Proper location update
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      updatedData.location = literal(
        `ST_SetSRID(ST_Point(${Number(longitude)}, ${Number(latitude)}), 4326)`
      );
    }

    await crime.update(updatedData);

    res.json({ success: true, message: "Crime updated successfully" });

  } catch (err) {
    console.error("Error updating crime:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteCrime = async (req, res) => {
  try {
    const { id } = req.params;

        const crime = await Crime.findByPk(id);
        if (!crime) {
            return res.status(404).json({ success: false, message: "Crime not found" });
        }

    await crime.destroy();

        res.status(200).json({ success: true, message: "Crime deleted successfully" });
    } catch (error) {
        console.error("Delete Crime Error:", error);
        res.status(500).json({ success: false, message: "Error deleting crime" });
    }
};


// ===================================================
// 🔍 SEARCH CRIMES
// ===================================================
// export const searchCrimes = async (req, res) => {
//   try {
//     const { role } = req.user;
//     const {
//       crime_type_id,
//       start_date,
//       end_date,
//       zone_id,
//       case_id,
//       officer_name,
//       officer_id,
//       person_name,
//     } = req.query;

//     const whereClause = {};

//         // 🔹 Common filters
//         if (crime_type_id) whereClause.crime_type_id = crime_type_id;
//         if (zone_id) whereClause.zone_id = zone_id;
//         if (start_date && end_date) {
//             whereClause.date = { [Op.between]: [new Date(start_date), new Date(end_date)] };
//         }

//         // 🔸 Admin & Police-only filters
//         if (["admin", "police"].includes(role)) {
//             if (case_id) whereClause.id = case_id;
//             if (officer_id) whereClause.officer_id = officer_id;
//             if (officer_name) whereClause["$User.name$"] = { [Op.iLike]: `%${officer_name}%` };
//             if (person_name) whereClause["$Criminal.name$"] = { [Op.iLike]: `%${person_name}%` };
//         }

//         // 🚫 Restrict Public users from sensitive filters
//         if (role === "public" && (case_id || officer_id || officer_name || person_name)) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized filters for public users.",
//             });
//         }

//         // 🔍 Execute query
//         const crimes = await Crime.findAll({
//             where: whereClause,
//             include: [
//                 { model: User, attributes: ["id", "name"], required: false },
//                 { model: Criminal, as: "criminals", attributes: ["id", "name"], required: false },
//             ]
//             ,
//         });

//     res.status(200).json({ success: true, data: crimes });
//   } catch (error) {
//     console.error("Search Error:", error);
//     res.status(500).json({ success: false, message: "Error searching crimes" });
//   }
// };


// ===================================================
// ✏️ UPDATE CRIME
// ===================================================
// export const updateCrime = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, description, crime_type_id, date, location, address, zone_id, status } = req.body;

//         const crime = await Crime.findByPk(id);
//         if (!crime) {
//             return res.status(404).json({ success: false, message: "Crime not found" });
//         }

//         // Build update data dynamically
//         const updateData = { title, description, crime_type_id, date, address, zone_id, status };

//         if (location && location.lat && location.lng) {
//             updateData.location = literal(`ST_SetSRID(ST_Point(${location.lng}, ${location.lat}), 4326)`);
//         }

//     await crime.update(updateData);

//         res.status(200).json({ success: true, message: "Crime updated successfully", data: crime });
//     } catch (error) {
//         console.error("Update Crime Error:", error);
//         res.status(500).json({ success: false, message: "Error updating crime" });
//     }
// };

// ===================================================
// ❌ DELETE CRIME
// ===================================================
