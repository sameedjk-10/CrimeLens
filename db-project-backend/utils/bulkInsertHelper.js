// utils/bulkInsertHelper.js
import { Op } from "sequelize";

/**
 * Helper: rounds a float to given decimals
 */
const round = (num, decimals = 6) => {
  if (typeof num !== "number" || Number.isNaN(num)) return null;
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

/**
 * buildKey - composite key for duplicate detection
 * keyParts: crime_type_id|dateISO|zone_id|latR|lonR
 */
const buildKey = ({ crime_type_id, dateISO, zone_id, latR, lonR }) =>
  `${crime_type_id}|${dateISO}|${zone_id}|${latR}|${lonR}`;

/**
 * preloadReferenceSets - load valid crime_type ids and zone ids
 */
async function preloadReferenceSets(db) {
  const validCrimeTypes = new Set();
  const validZones = new Set();

  // try to fetch crime_types
  try {
    const cts = await db.sequelize.query("SELECT id FROM crime_types", { type: db.sequelize.QueryTypes.SELECT });
    cts.forEach((r) => validCrimeTypes.add(String(r.id)));
  } catch (e) {
    // If table doesn't exist or error, leave empty (we'll catch FK errors later)
    // But better to fail early—caller can handle
  }

  try {
    const zs = await db.sequelize.query("SELECT id FROM zones", { type: db.sequelize.QueryTypes.SELECT });
    zs.forEach((r) => validZones.add(String(r.id)));
  } catch (e) {
    // ignore
  }

  return { validCrimeTypes, validZones };
}

/**
 * fetchExistingKeysFromDB
 * Performs a single (or small set of) DB queries to collect existing keys
 * returns a Set of keys in same format as buildKey
 */
async function fetchExistingKeysFromDB(db, rows, CrimeModel) {
  // Prepare unique sets for query
  const crimeTypeIds = new Set();
  const zoneIds = new Set();
  const dates = new Set();

  for (const r of rows) {
    crimeTypeIds.add(r.crime_type_id);
    zoneIds.add(r.zone_id);
    // Keep date normalized (YYYY-MM-DDTHH:MM:SSZ or date-only) string
    dates.add(r.dateISO);
  }

  const where = {
    crime_type_id: { [Op.in]: Array.from(crimeTypeIds) },
    zone_id: { [Op.in]: Array.from(zoneIds) },
    date: { [Op.in]: Array.from(dates) },
  };

  // Query DB selecting lon/lat via PostGIS functions
  // Use sequelize.fn for ST_X/ST_Y
  // We'll use CrimeModel.findAll with attributes and where
  const existingKeys = new Set();

  // If no filter values, return empty set
  if (!crimeTypeIds.size || !zoneIds.size || !dates.size) return existingKeys;

  // fetch
  const existing = await CrimeModel.findAll({
    attributes: [
      "crime_type_id",
      "date",
      "zone_id",
      [db.sequelize.fn("ST_X", db.sequelize.col("location")), "lon"],
      [db.sequelize.fn("ST_Y", db.sequelize.col("location")), "lat"],
    ],
    where,
    raw: true,
  });

  for (const e of existing) {
    const lat = parseFloat(e.lat);
    const lon = parseFloat(e.lon);
    const latR = round(lat, 6);
    const lonR = round(lon, 6);
    const dateISO = new Date(e.date).toISOString();
    const key = buildKey({
      crime_type_id: String(e.crime_type_id),
      dateISO,
      zone_id: String(e.zone_id),
      latR,
      lonR,
    });
    existingKeys.add(key);
  }

  return existingKeys;
}

/**
 * prepareInsertPayloads
 * - accepts cleanedRows (rows validated for required presence and FK existence)
 * - returns { toInsert: [], duplicateCount, invalidCount }
 */
function prepareInsertPayloads(cleanedRows, existingKeys) {
  const toInsert = [];
  let duplicates = 0;

  const seenKeys = new Set(); // to handle CSV-duplicate rows

  for (const r of cleanedRows) {
    const lat = parseFloat(r.latitude);
    const lon = parseFloat(r.longitude);
    const latR = round(lat, 6);
    const lonR = round(lon, 6);

    const key = buildKey({
      crime_type_id: String(r.crime_type_id),
      dateISO: r.dateISO,
      zone_id: String(r.zone_id),
      latR,
      lonR,
    });

    if (seenKeys.has(key)) {
      duplicates++;
      continue; // CSV internal duplicate
    }
    seenKeys.add(key);

    if (existingKeys.has(key)) {
      duplicates++;
      continue; // DB duplicate
    }

    // build payload for Sequelize, including geometry
    const payload = {
      title: r.title,
      description: r.description || null,
      crime_type_id: r.crime_type_id,
      date: r.dateObj, // Date object
      status: "verified",
      // Sequelize expects geometry as { type: 'Point', coordinates: [lon, lat] }
      location: { type: "Point", coordinates: [lon, lat] },
      address: r.address || null,
      zone_id: r.zone_id,

    };

    toInsert.push(payload);
  }

  return { toInsert, duplicates };
}

/**
 * bulkInsertWithChunking
 * Attempts bulkCreate in one go; if it fails (rare), then falls back to chunked inserts,
 * and then to row-by-row inserts to maximize successful inserts.
 */
async function bulkInsertWithChunking(CrimeModel, toInsert, db, chunkSize = 100) {
  let inserted = 0;
  if (!toInsert.length) return inserted;

  try {
    // single transaction/wide bulk insert
    const result = await CrimeModel.bulkCreate(toInsert, { validate: true });
    inserted = result.length;
    return inserted;
  } catch (e) {
    // fallback: chunked insert with transaction per chunk
    inserted = 0;
    for (let i = 0; i < toInsert.length; i += chunkSize) {
      const chunk = toInsert.slice(i, i + chunkSize);
      try {
        const res = await CrimeModel.bulkCreate(chunk, { validate: true });
        inserted += res.length;
      } catch (chunkErr) {
        // fallback to row-by-row for this chunk
        for (const row of chunk) {
          try {
            await CrimeModel.create(row);
            inserted++;
          } catch (singleErr) {
            // skip problematic row
            // (we do not rethrow here to maximize inserts)
          }
        }
      }
    }
    return inserted;
  }
}

export {
  preloadReferenceSets,
  fetchExistingKeysFromDB,
  prepareInsertPayloads,
  bulkInsertWithChunking,
};
