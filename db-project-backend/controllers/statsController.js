

import { Op, fn, col, literal } from "sequelize";
import db from "../models/index.js";

export const getStatsSummary = async (req, res) => {
  try {
    const { Crime, CrimeType, Zone } = db;

    // Total zones
    const totalZones = await Zone.count();

    // Total approved crimes in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalCrimes = await Crime.count({
      where: {
        status: "approved",
        reportedAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Top Crime Type (approved only)
    const topCrimeType = await CrimeType.findOne({
      attributes: [
        "id",
        "name",
        [
          literal(`
            (
              SELECT COUNT(*) 
              FROM "Crime" AS c 
              WHERE c."crimeTypeId" = "CrimeType"."id"
              AND c."status" = 'approved'
            )
          `),
          "crimeCount"
        ]
      ],
      order: [
        [
          literal(`
            (
              SELECT COUNT(*) 
              FROM "Crime" AS c 
              WHERE c."crimeTypeId" = "CrimeType"."id"
              AND c."status" = 'approved'
            )
          `),
          "DESC"
        ]
      ],
      limit: 1
    });

    // Top Zone (approved only)
    const topZone = await Zone.findOne({
      attributes: [
        "id",
        "name",
        [
          literal(`
            (
              SELECT COUNT(*) 
              FROM "Crime" AS c 
              WHERE c."zoneId" = "Zone"."id"
              AND c."status" = 'approved'
            )
          `),
          "crimeCount"
        ]
      ],
      order: [
        [
          literal(`
            (
              SELECT COUNT(*) 
              FROM "Crime" AS c 
              WHERE c."zoneId" = "Zone"."id"
              AND c."status" = 'approved'
            )
          `),
          "DESC"
        ]
      ],
      limit: 1
    });

    res.json({
      totalZones,
      totalCrimes,
      topCrimeType,
      topZone
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load summary" });
  }
};



// -----------------------------
// 📌 PIE CHART — Crimes by Type
// -----------------------------
export const getCrimesByType = async (req, res) => {
  try {
    const { start, end } = req.query;
    const { Crime, CrimeType } = db;

    const rows = await Crime.findAll({
      attributes: [
        "crimeTypeId",
        [fn("COUNT", col("Crime.id")), "count"]
      ],
      where: {
        status: "approved",
        ...(start && end ? { reportedAt: { [Op.between]: [start, end] } } : {})
      },
      include: [
        {
          model: CrimeType,
          attributes: ["name"]
        }
      ],
      group: ["crimeTypeId", "CrimeType.id"]
    });

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Pie chart failed" });
  }
};



// -----------------------------
// 📌 BAR CHART — Crimes by Zone
// -----------------------------
export const getCrimesByZone = async (req, res) => {
  try {
    const { start, end } = req.query;
    const { Crime, Zone } = db;

    const rows = await Crime.findAll({
      attributes: [
        "zoneId",
        [fn("COUNT", col("Crime.id")), "count"]
      ],
      where: {
        status: "approved",
        ...(start && end ? { reportedAt: { [Op.between]: [start, end] } } : {})
      },
      include: [
        {
          model: Zone,
          attributes: ["name"]
        }
      ],
      group: ["zoneId", "Zone.id"]
    });

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bar chart failed" });
  }
};



// -----------------------------
// 📌 LINE CHART — Monthly Trend
// -----------------------------
export const getCrimeTrend = async (req, res) => {
  try {
    const { crimeTypeId, start, end } = req.query;
    const { Crime } = db;``

    const whereClause = {
      status: "approved"
    };

    if (crimeTypeId && !isNaN(Number(crimeTypeId))) {
      whereClause.crimeTypeId = Number(crimeTypeId);
    }

    if (start && end) {
      whereClause.reportedAt = { [Op.between]: [start, end] };
    }

    const rows = await Crime.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("reportedAt")), "month"],
        [fn("COUNT", col("id")), "count"]
      ],
      where: whereClause,
      group: [literal("month")],
      order: [[literal("month"), "ASC"]]
    });

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Line chart failed" });
  }
};
