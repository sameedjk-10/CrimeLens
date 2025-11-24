// backend/controllers/zoneController.js
import db from "../models/index.js";
import { Op } from "sequelize";

export const getZoneSeverity = async (req, res) => {
  try {
    const { crimeType, zoneId, startDate, endDate } = req.query;

    const crimeWhere = {};

    if (crimeType && crimeType !== "All") {
      crimeWhere["$CrimeType.name$"] = crimeType;
    }

    if (zoneId && zoneId !== "All") {
      crimeWhere.zoneId = zoneId;
    }

    if (startDate || endDate) {
      crimeWhere.incidentDate = {};
      if (startDate) crimeWhere.incidentDate[Op.gte] = new Date(startDate);
      if (endDate) crimeWhere.incidentDate[Op.lte] = new Date(endDate);
    }

    // Use db.sequelize.query instead of Sequelize.query
    const zones = await db.sequelize.query(
      `
      SELECT 
        "Zone".id,
        "Zone".name,
        ST_AsGeoJSON("Zone".boundary)::json AS boundary,
        COALESCE(SUM("CrimeType".severity), 0) AS "totalSeverity"
      FROM "Zone"
      LEFT JOIN "Crime" ON "Crime"."zoneId" = "Zone".id
      LEFT JOIN "CrimeType" ON "CrimeType".id = "Crime"."crimeTypeId"
      WHERE 1=1
      ${crimeType && crimeType !== "All" ? `AND "CrimeType".name = '${crimeType}'` : ""}
      ${zoneId && zoneId !== "All" ? `AND "Zone".id = ${zoneId}` : ""}
      ${startDate ? `AND "Crime"."incidentDate" >= '${startDate}'` : ""}
      ${endDate ? `AND "Crime"."incidentDate" <= '${endDate}'` : ""}
      GROUP BY "Zone".id
      ORDER BY "Zone".id ASC;
      `,
      { type: db.sequelize.QueryTypes.SELECT }
    );

    res.json(
      zones.map((z) => {
        const coords = z.boundary?.coordinates?.[0] || []; // GeoJSON polygon outer ring

        return {
          zoneId: z.id,
          zoneName: z.name,
          totalSeverity: Number(z.totalSeverity),

          // Convert GeoJSON -> Leaflet
          cordinates: coords.map(([lng, lat]) => [lat, lng])
        };
      })
    );
  } catch (err) {
    console.log("\n zoneController catch error ");
    console.error("Error fetching zone severity:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * GET /api/zones
 * Returns all zones from Zones table
 */
export const getAllZones = async (req, res) => {
  try {
    const zones = await db.Zone.findAll({
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    res.json(zones);
  } catch (err) {
    console.error("Error fetching zones:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
