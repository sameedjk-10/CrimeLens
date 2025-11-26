// // controllers/statsController.js
// import { Op, fn, col, literal, Sequelize } from "sequelize";
// import db from "../models/index.js" // adjust path to your models index
// const { Crime , Zone , CrimeType , sequelize } = db;
// /**
//  * Helper to parse date range from query and return start/end Date objects.
//  * If not provided, defaults to last 30 days.
//  */
// function parseDateRange(query) {
//   const { startDate, endDate } = query;
//   let start = startDate ? new Date(startDate) : null;
//   let end = endDate ? new Date(endDate) : null;
//   if (start && isNaN(start)) start = null;
//   if (end && isNaN(end)) end = null;
//   return { start, end };
// }

// /**
//  * GET /api/stats/overview
//  * Basic counts (total crimes, total zones, total crime types, topCrimeType, topZone)
//  */
// export const overview = async (req, res) => {
//   try {
//     const totalCrimes = await Crime.count();
//     const totalZones = await Zone.count();
//     const totalCrimeTypes = await CrimeType.count();

//     // Top crime type overall (by count)
//     const topCrimeTypeRow = await Crime.findAll({
//       attributes: [
//         "crimeTypeId",
//         [fn("COUNT", col("Crime.id")), "count"]
//       ],
//       group: ["crimeTypeId"],
//       order: [[literal("count"), "DESC"]],
//       limit: 1,
//       raw: true,
//     });

//     let topCrimeType = null;
//     if (topCrimeTypeRow.length) {
//       const ct = await CrimeType.findByPk(topCrimeTypeRow[0].crimeTypeId);
//       topCrimeType = ct ? ct.name : null;
//     }

//     // Top zone overall
//     const topZoneRow = await Crime.findAll({
//       attributes: [
//         "zoneId",
//         [fn("COUNT", col("Crime.id")), "count"]
//       ],
//       where: { zoneId: { [Op.ne]: null } },
//       group: ["zoneId"],
//       order: [[literal("count"), "DESC"]],
//       limit: 1,
//       raw: true,
//     });

//     let topZone = null;
//     if (topZoneRow.length) {
//       const z = await Zone.findByPk(topZoneRow[0].zoneId);
//       topZone = z ? z.name : null;
//     }

//     res.json({
//       totalCrimes,
//       totalZones,
//       totalCrimeTypes,
//       topCrimeType,
//       topZone,
//     });
//   } catch (err) {
//     console.error("overview error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * GET /api/stats/pie?startDate=&endDate=
//  * Returns [{ crimeType: string, count: number }]
//  * Groups by crime type.
//  */
// export const pie = async (req, res) => {
//   try {
//     const { start, end } = parseDateRange(req.query);
//     const where = {};
//     if (start || end) where.incidentDate = {};
//     if (start) where.incidentDate[Op.gte] = start;
//     if (end) where.incidentDate[Op.lte] = end;

//     const rows = await Crime.findAll({
//       attributes: [
//         [col("CrimeType.name"), "crimeType"],
//         [fn("COUNT", col("Crime.id")), "count"]
//       ],
//       where,
//       include: [
//         {
//           model: CrimeType,
//           attributes: []
//         }
//       ],
//       group: ["Crime.crimeTypeId", "CrimeType.name"],
//       order: [[literal("count"), "DESC"]],
//       raw: true,
//     });

//     // normalize to { crimeType, count }
//     const result = rows.map(r => ({ crimeType: r.crimeType, count: parseInt(r.count, 10) }));
//     res.json(result);
//   } catch (err) {
//     console.error("pie error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * GET /api/stats/bar?startDate=&endDate=
//  * Returns [{ zone: string, count: number }]
//  * Groups by zone name (zones with null zoneId are grouped as 'Unknown').
//  */
// export const bar = async (req, res) => {
//   try {
//     const { start, end } = parseDateRange(req.query);
//     const where = {};
//     if (start || end) where.incidentDate = {};
//     if (start) where.incidentDate[Op.gte] = start;
//     if (end) where.incidentDate[Op.lte] = end;

//     // Use left join to include zone names; unknown zones show as "Unknown"
//     const rows = await Crime.findAll({
//       attributes: [
//         [fn("COALESCE", col("Zone.name"), literal("'Unknown'")), "zone"],
//         [fn("COUNT", col("Crime.id")), "count"]
//       ],
//       where,
//       include: [
//         {
//           model: Zone,
//           attributes: []
//         }
//       ],
//       group: ["Zone.name"],
//       order: [[literal("count"), "DESC"]],
//       raw: true,
//     });

//     const result = rows.map(r => ({ zone: r.zone, count: parseInt(r.count, 10) }));
//     res.json(result);
//   } catch (err) {
//     console.error("bar error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * GET /api/stats/line?crimeTypeId=&startDate=&endDate=
//  * Returns time series grouped by month (YYYY-MM) for the given crimeTypeId.
//  * If crimeTypeId is omitted, returns overall crime count over time.
//  *
//  * NOTE: uses a raw SQL query with generate_series to return zero counts for months
//  * that have no rows between the range. Works for PostgreSQL.
//  */
// export const line = async (req, res) => {
//   try {
//     let { crimeTypeId, startDate, endDate } = req.query;

//     // Max 5 years constraint
//     const now = new Date();
//     let start = startDate ? new Date(startDate) : new Date(now.getFullYear() - 1, now.getMonth(), 1);
//     let end = endDate ? new Date(endDate) : now;

//     // normalize to start of month / end of month
//     start = new Date(start.getFullYear(), start.getMonth(), 1);
//     end = new Date(end.getFullYear(), end.getMonth(), 1);
//     // ensure end >= start
//     if (end < start) {
//       return res.status(400).json({ error: "endDate must be >= startDate" });
//     }

//     const msPerYear = 1000 * 60 * 60 * 24 * 365;
//     const yearsSpan = (end - start) / msPerYear;
//     if (yearsSpan > 5) {
//       return res.status(400).json({ error: "Maximum allowed range is 5 years" });
//     }

//     // crimeTypeId optional
//     const ctCond = crimeTypeId ? `AND "crime"."crimeTypeId" = ${parseInt(crimeTypeId, 10)}` : "";

//     // Use incidentDate for grouping. Adjust column name to match your table name/casing if needed
//     const sql = `
//       WITH months AS (
//         SELECT to_char(months.month, 'YYYY-MM') AS month_label, months.month
//         FROM generate_series(
//           date_trunc('month', :start),
//           date_trunc('month', :end),
//           interval '1 month'
//         ) AS months(month)
//       )
//       SELECT
//         m.month_label AS month,
//         COALESCE(t.count, 0) AS count
//       FROM months m
//       LEFT JOIN (
//         SELECT to_char(date_trunc('month', "incidentDate"), 'YYYY-MM') AS mon, COUNT(*) as count
//         FROM "Crime" as crime
//         WHERE crime."incidentDate" BETWEEN :start AND (:end + interval '1 month' - interval '1 second')
//         ${ctCond}
//         GROUP BY mon
//       ) t ON t.mon = m.month_label
//       ORDER BY m.month;
//     `;

//     const replacements = {
//       start: start.toISOString(),
//       end: end.toISOString()
//     };

//     const rows = await sequelize.query(sql, {
//       type: Sequelize.QueryTypes.SELECT,
//       replacements
//     });

//     // rows: [{ month: '2023-01', count: '12' }, ...]
//     const result = rows.map(r => ({ month: r.month, count: parseInt(r.count, 10) }));
//     res.json(result);
//   } catch (err) {
//     console.error("line error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// controllers/statsController.js
import { Op, fn, col, literal } from "sequelize";
import db from "../models/index.js";

export const getStatsSummary = async (req, res) => {
  try {
    const { Crime, CrimeType, Zone } = db;

    // Total zones and crimes
    const totalZones = await Zone.count();
    const totalCrimes = await Crime.count();

    // Top Crime Type
    const topCrimeType = await CrimeType.findOne({
      attributes: [
        "id",
        "name",
        [literal(`(SELECT COUNT(*) FROM "Crime" AS "c" WHERE "c"."crimeTypeId" = "CrimeType"."id")`), "crimeCount"]
      ],
      order: [
        [literal(`(SELECT COUNT(*) FROM "Crime" AS "c" WHERE "c"."crimeTypeId" = "CrimeType"."id")`), "DESC"]
      ],
      limit: 1
    });

    // Top Zone
    const topZone = await Zone.findOne({
      attributes: [
        "id",
        "name",
        [literal(`(SELECT COUNT(*) FROM "Crime" AS "c" WHERE "c"."zoneId" = "Zone"."id")`), "crimeCount"]
      ],
      order: [
        [literal(`(SELECT COUNT(*) FROM "Crime" AS "c" WHERE "c"."zoneId" = "Zone"."id")`), "DESC"]
      ],
      limit: 1
    });

    res.json({
      totalZones,
      totalCrimes,
      topCrimeType,
      topZone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load summary" });
  }
};

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

export const getCrimeTrend = async (req, res) => {
  try {
    const { crimeTypeId, start, end } = req.query;
    const { Crime } = db;

    const whereClause = {};

    // Only filter by crimeTypeId if provided and not empty
    if (crimeTypeId && !isNaN(Number(crimeTypeId))) {
      whereClause.crimeTypeId = Number(crimeTypeId);
    }

    // Only filter by date range if both start and end are provided
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
