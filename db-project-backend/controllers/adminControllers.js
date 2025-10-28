// controllers/adminController.js
import db from "../models/index.js";
const { sequelize } = db;
import { parseCSVBuffer } from "../utils/fileParser.js";
import {
  preloadReferenceSets,
  fetchExistingKeysFromDB,
  prepareInsertPayloads,
  bulkInsertWithChunking,
} from "../utils/bulkInsertHelper.js";

const Crime = db.Crime;
const UploadLog = db.UploadLog;

const REQUIRED_FIELDS = ["title", "crime_type_id", "date", "latitude", "longitude", "zone_id"];

/**
 * uploadCrimesCSV - main endpoint controller
 * Expects multer.memoryStorage used in route (req.file.buffer present)
 */
export const uploadCrimesCSV = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "CSV file missing" });
    }

    const originalname = req.file.originalname || "upload.csv";

    // 1) Parse CSV buffer
    const { rows: rawRows, parseInvalids, total } = await parseCSVBuffer(req.file.buffer, {
      requiredFields: REQUIRED_FIELDS,
    });

    // early stats
    let invalid = parseInvalids.length;
    let duplicates = 0;
    let inserted = 0;

    if (!rawRows.length) {
      // write upload log as completed with zero uploaded but containing reasons
      await UploadLog.create({
        filename: originalname,
        status: "completed",
        total_records: total,
        records_uploaded: 0,
      });
      return res.status(200).json({
        success: true,
        message: "No valid rows found in CSV",
        stats: { total, inserted: 0, duplicates: 0, invalid },
        parseInvalids,
      });
    }

    // 2) Preload reference sets (crime_types, zones) to validate FK existence
    const { validCrimeTypes, validZones } = await preloadReferenceSets(db);

    // 3) Normalize rows and further validate & convert types
    const cleanedRows = [];
    for (const r of rawRows) {
      // basic transforms
      const row = {
        title: r.title?.trim(),
        description: (r.description ?? "").trim() || null,
        crime_type_id: r.crime_type_id ? String(r.crime_type_id).trim() : null,
        dateRaw: r.date?.trim(),
        status: r.status?.trim() || "verified",
        latitude: r.latitude,
        longitude: r.longitude,
        address: r.address?.trim() || null,
        zone_id: r.zone_id ? String(r.zone_id).trim() : null,
      };

      // required fields presence already checked by parser, but check types now
      const missing = [];
      for (const f of REQUIRED_FIELDS) {
        if (!row[f] && row[f] !== 0) missing.push(f);
      }
      if (missing.length) {
        invalid++;
        continue;
      }

      // validate numeric lat/lon
      const lat = parseFloat(row.latitude);
      const lon = parseFloat(row.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        invalid++;
        continue;
      }

      // validate date parseable
      const dateObj = new Date(row.dateRaw);
      if (Number.isNaN(dateObj.getTime())) {
        invalid++;
        continue;
      }
      // normalize to ISO for comparison
      const dateISO = dateObj.toISOString();

      // validate FK existence (if sets are available; if sets empty we skip strict check)
      if (validCrimeTypes.size && !validCrimeTypes.has(String(row.crime_type_id))) {
        invalid++;
        continue;
      }
      if (validZones.size && !validZones.has(String(row.zone_id))) {
        invalid++;
        continue;
      }

      cleanedRows.push({
        ...row,
        dateISO,
        dateObj,
        latitude: lat,
        longitude: lon,
      });
    }

    if (!cleanedRows.length) {
      // update upload log and return
      await UploadLog.create({
        filename: originalname,
        status: "completed",
        total_records: total,
        records_uploaded: 0,
      });
      return res.status(200).json({
        success: true,
        message: "No valid rows after validation",
        stats: { total, inserted: 0, duplicates: 0, invalid },
      });
    }

    // 4) Fetch existing keys from DB to detect duplicates (single optimized query)
    const existingKeys = await fetchExistingKeysFromDB(db, cleanedRows, Crime);

    // 5) Prepare payloads: compare against existing keys and build toInsert
    // internal helper will also count duplicates (both CSV internal dup and DB-dup)
    const { toInsert, duplicates: dupCount } = prepareInsertPayloads(
      cleanedRows.map((r) => ({
        title: r.title,
        description: r.description,
        crime_type_id: r.crime_type_id,
        dateISO: r.dateISO,
        dateObj: r.dateObj,
        latitude: r.latitude,
        longitude: r.longitude,
        address: r.address,
        zone_id: r.zone_id,
      })),
      existingKeys
    );

    duplicates += dupCount;

    // 6) Insert new rows with bulk insert + chunk fallback
    if (toInsert.length) {
      try {
        // Attempt bulk insert (helper handles fallback)
        const insertedCount = await bulkInsertWithChunking(Crime, toInsert, db, 100);
        inserted = insertedCount;
      } catch (e) {
        // catastrophic insert failure -> log failed upload and return 500
        await UploadLog.create({
          filename: originalname,
          status: "failed",
          total_records: total,
          records_uploaded: inserted,
        });
        return res.status(500).json({
          success: false,
          message: "Fatal error during DB insert",
          error: e.message,
          stats: { total, inserted, duplicates, invalid },
        });
      }
    }

    // 7) Write upload log as completed
    await UploadLog.create({
      filename: originalname,
      status: "completed",
      total_records: total,
      records_uploaded: inserted,
    });

    // 8) Return summary response
    return res.status(200).json({
      success: true,
      message: "Upload completed",
      stats: { total, inserted, duplicates, invalid },
    });
  } catch (err) {
    // Unexpected error -> write failed log (with minimal info) and return 500
    try {
      const originalname = req.file?.originalname || "upload.csv";
      await UploadLog.create({
        filename: originalname,
        status: "failed",
        total_records: 0,
        records_uploaded: 0,
      });
    } catch (e) {
      // ignore
    }
    return next(err);
  }
};
