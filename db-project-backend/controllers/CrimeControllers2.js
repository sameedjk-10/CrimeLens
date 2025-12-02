// controllers/crimeController.js
import { Sequelize } from "sequelize";
import { Op, fn, col, literal, QueryTypes ,  } from "sequelize";
import sequelize from "../config/db.js";
import db from "../models/index.js";
const { Crime, CrimeSubmission, CrimeReportsSubmitter, CrimeType, Zone } = db;

// ===================================================
// 🌍 GET CRIMES FOR MAP (GeoJSON)
// ===================================================
export const getCrimesForMap = async (req, res) => {
  try {
    const { mode, crimeType, zoneId, startDate, endDate, lat, lng, radius } = req.query;

    // Base SQL (JOINs first)
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
      WHERE c.status = 'approved'
    `;

    const conditions = [];
    const replacements = {};

    // Filter: crime type
    if (crimeType && crimeType !== "All") {
      conditions.push(`ct.name ILIKE :crimeType`);
      replacements.crimeType = crimeType;
    }

    // Filter: zone
    if (zoneId && zoneId !== "All") {
      conditions.push(`c."zoneId" = :zoneId`);
      replacements.zoneId = zoneId;
    }

    // Date filters
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

    // Append additional conditions
    if (conditions.length > 0) {
      sql += " AND " + conditions.join(" AND ");
    }

    sql += ";";

    // Execute the query
    const crimes = await db.sequelize.query(sql, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements,
    });

    // Format output
    const formatted = crimes
      .map((c) => {
        if (!c.geom) return null;
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
      .filter(Boolean);

    return res.json(formatted);

  } catch (err) {
    console.error("Map Crime Error:", err);
    res.status(500).json([]);
  }
};

export const getAllCrimeTypes = async (req, res) => {
  try {
    const crimeTypes = await sequelize.query(
      `
      SELECT id, name
      FROM "CrimeType"
      ORDER BY name ASC;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(crimeTypes);
  } catch (err) {
    console.error("Error fetching crime types:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPendingSubmissions = async (req, res) => {
  try {
    const pendingCrimes = await Crime.findAll({
      where: { status: "pending" },

      // include standard relations (CrimeType, Zone) so frontend can use them
      include: [
        {
          model: CrimeType,
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Zone,
          attributes: ["id"], // zone only has id as you said
          required: false,
        },
      ],

      // add flattened fields using SQL subqueries (aliased)
      attributes: {
        include: [
          // submission id
          [
            literal(`(
              SELECT cs."id"
              FROM "CrimeSubmission" cs
              WHERE cs."CrimeId" = "Crime"."id"
              ORDER BY cs."submittedAt" DESC
              LIMIT 1
            )`),
            "submissionId",
          ],

          // submitter CNIC from CrimeSubmission
          [
            literal(`(
              SELECT cs."submitterCnic"
              FROM "CrimeSubmission" cs
              WHERE cs."CrimeId" = "Crime"."id"
              ORDER BY cs."submittedAt" DESC
              LIMIT 1
            )`),
            "submitterCnic",
          ],

          // submittedAt
          [
            literal(`(
              SELECT cs."submittedAt"
              FROM "CrimeSubmission" cs
              WHERE cs."CrimeId" = "Crime"."id"
              ORDER BY cs."submittedAt" DESC
              LIMIT 1
            )`),
            "submittedAt",
          ],

          // submitterName from CrimeReportsSubmitter joined by submitterCnic
          [
            literal(`(
              SELECT crs."submitterName"
              FROM "CrimeSubmission" cs
              JOIN "CrimeReportsSubmitter" crs
                ON crs."submitterCnic" = cs."submitterCnic"
              WHERE cs."CrimeId" = "Crime"."id"
              ORDER BY cs."submittedAt" DESC
              LIMIT 1
            )`),
            "submitterName",
          ],

          // submitterContact from CrimeReportsSubmitter
          [
            literal(`(
              SELECT crs."submitterContact"
              FROM "CrimeSubmission" cs
              JOIN "CrimeReportsSubmitter" crs
                ON crs."submitterCnic" = cs."submitterCnic"
              WHERE cs."CrimeId" = "Crime"."id"
              ORDER BY cs."submittedAt" DESC
              LIMIT 1
            )`),
            "submitterContact",
          ],
        ],
      },

      order: [["reportedAt", "DESC"]],
      limit: 100, // optional: protect large responses
    });

    res.status(200).json({ success: true, data: pendingCrimes });
  } catch (error) {
    console.error("Fetch Pending Crimes Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending submissions",
    });
  }
};

export const approveCrimeReport = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { address, latitude, longitude, title, description } = req.body;

    // ---------------------------
    // 1️⃣ Fetch CrimeSubmission record
    // ---------------------------
    const submissionRows = await sequelize.query(
      `
      SELECT id, "CrimeId"
      FROM "CrimeSubmission"
      WHERE id = :submissionId
      LIMIT 1;
      `,
      {
        replacements: { submissionId },
        type: QueryTypes.SELECT,
      }
    );

    const submission = submissionRows[0];
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Crime submission not found",
      });
    }

    // ---------------------------
    // 2️⃣ Fetch corresponding Crime record
    // ---------------------------
    const crimeRows = await sequelize.query(
      `
      SELECT *
      FROM "Crime"
      WHERE id = :crimeId
      LIMIT 1;
      `,
      {
        replacements: { crimeId: submission.CrimeId },
        type: QueryTypes.SELECT,
      }
    );

    const crime = crimeRows[0];
    if (!crime) {
      return res.status(404).json({
        success: false,
        message: "Associated crime record not found",
      });
    }

    if (crime.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Crime report already processed",
      });
    }

    // ---------------------------
    // 3️⃣ Prepare updated data
    // ---------------------------
    let locationSQL = "location"; // keep existing if no lat/lng
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      locationSQL = `ST_SetSRID(ST_Point(${Number(longitude)}, ${Number(
        latitude
      )}), 4326)`;
    }

    const updatedCrimeRows = await sequelize.query(
      `
      UPDATE "Crime"
      SET status = 'approved',
          address = :address,
          title = :title,
          description = :description,
          location = ${locationSQL}
      WHERE id = :crimeId
      RETURNING id, status;
      `,
      {
        replacements: {
          address: address || crime.address,
          title: title || crime.title,
          description: description || crime.description,
          crimeId: crime.id,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const updatedCrime = updatedCrimeRows[0][0];

    // ---------------------------
    // 4️⃣ Response
    // ---------------------------
    res.status(200).json({
      success: true,
      message: "Crime report approved and verified",
      data: {
        submissionId: submissionId,
        crimeId: updatedCrime.id,
        status: updatedCrime.status,
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



export const rejectCrimeReport = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { reason } = req.body;

    console.log("\n")
    console.log(submissionId)
    console.log("\n")

    // 1️⃣ Find the CrimeSubmission record
    const submission = await CrimeSubmission.findByPk(submissionId);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Crime submission not found" });
    }

    // 2️⃣ Find the corresponding Crime record
    const crime = await Crime.findByPk(submission.CrimeId);
    if (!crime) {
      return res
        .status(404)
        .json({ success: false, message: "Associated crime record not found" });
    }

    // 3️⃣ Update Crime status to rejected
    await crime.update({
      status: "rejected",
    });

    res.status(200).json({
      success: true,
      message: "Crime report rejected",
      data: { crimeId: crime.id, status: crime.status },
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
      title,
    } = req.body;

    if (!cnic || !date || !crimeTypeId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // ---------------------------
    // 1️⃣ Check if submitter exists
    // ---------------------------
    let submitterRecord = await sequelize.query(
      `
      SELECT submitterCnic, submitterName, submitterContact
      FROM "CrimeReportsSubmitter"
      WHERE submitterCnic = :cnic
      LIMIT 1;
      `,
      {
        replacements: { cnic },
        type: QueryTypes.SELECT,
      }
    );

    let submitter = submitterRecord[0];

    // ---------------------------
    // 2️⃣ Create submitter if not exists, else update info
    // ---------------------------
    if (!submitter) {
      await sequelize.query(
        `
        INSERT INTO "CrimeReportsSubmitter" (submitterCnic, submitterName, submitterContact)
        VALUES (:cnic, :name, :contact)
        `,
        {
          replacements: { cnic, name: fullName || null, contact: contact || null },
          type: QueryTypes.INSERT,
        }
      );
    } else {
      // Update existing submitter info
      if (fullName || contact) {
        await sequelize.query(
          `
          UPDATE "CrimeReportsSubmitter"
          SET 
            submitterName = COALESCE(:name, submitterName),
            submitterContact = COALESCE(:contact, submitterContact)
          WHERE submitterCnic = :cnic
          `,
          {
            replacements: { cnic, name: fullName, contact },
            type: QueryTypes.UPDATE,
          }
        );
      }
    }

    // ---------------------------
    // 3️⃣ Insert Crime record
    // ---------------------------
    const newCrimeRows = await sequelize.query(
      `
      INSERT INTO "Crime" 
        (title, description, "crimeTypeId", "incidentDate", "reportedAt", status, location, address, "zoneId")
      VALUES 
        (:title, :description, :crimeTypeId, :incidentDate, :reportedAt, 'pending', :location, :address, :zoneId)
      RETURNING *
      `,
      {
        replacements: {
          title: title || "Untitled Crime",
          description: description || null,
          crimeTypeId,
          incidentDate: date,
          reportedAt: new Date(),
          location: null, // adjust if using GeoJSON Point
          address: address || null,
          zoneId: zone || null,
        },
        type: QueryTypes.INSERT,
      }
    );

    const newCrime = newCrimeRows[0][0]; // RETURNING * gives array of inserted row(s)

    // ---------------------------
    // 4️⃣ Insert CrimeSubmission metadata
    // ---------------------------
    const newCrimeSubmissionRows = await sequelize.query(
      `
      INSERT INTO "CrimeSubmission" ("submitterCnic", "submittedAt", "CrimeId")
      VALUES (:cnic, :submittedAt, :crimeId)
      RETURNING *
      `,
      {
        replacements: {
          cnic,
          submittedAt: new Date(),
          crimeId: newCrime.id,
        },
        type: QueryTypes.INSERT,
      }
    );

    const newCrimeSubmission = newCrimeSubmissionRows[0][0];

    // ---------------------------
    // 5️⃣ Response
    // ---------------------------
    res.status(201).json({
      success: true,
      message: "Crime report submitted successfully",
      data: {
        crime: newCrime,
        submission: newCrimeSubmission,
      },
    });
  } catch (error) {
    console.error("Report Crime Error:", error);
    res.status(500).json({ success: false, message: "Error adding crime" });
  }
};
//done


// ===================================================
// 📌 GET ALL CRIMES (For Records Table)
// ===================================================
export const getAllCrimes = async (req, res) => {
  try {
    const crimes = await Crime.findAll({
      where: { status: "approved" },  // ✅ Only approved crimes
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
            WHERE cs."CrimeId" = "Crime"."id"
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
      where: {
        id,
        status: "approved"   // ✅ Only approved crimes
      },
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