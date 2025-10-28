// utils/fileParser.js
import { parse } from "fast-csv";

/**
 * parseCSVBuffer
 * @param {Buffer} buffer - req.file.buffer from multer.memoryStorage
 * @param {Object} options
 *   options.requiredFields = [ 'title', 'crime_type_id', 'date', 'latitude', 'longitude', 'zone_id' ]
 * @returns {Promise<{rows: Array, parseInvalids: Array, total: number}>}
 */
export function parseCSVBuffer(buffer, options = {}) {
  const requiredFields = options.requiredFields || [
    "title",
    "crime_type_id",
    "date",
    "latitude",
    "longitude",
    "zone_id",
  ];

  return new Promise((resolve, reject) => {
    const rows = [];
    const parseInvalids = [];
    let total = 0;

    const stream = parse({ headers: true, trim: true, ignoreEmpty: true })
      .on("error", (err) => {
        return reject(err);
      })
      .on("data", (row) => {
        total += 1;
        // Normalize keys: keep as-is (CSV headers should match expected)
        // Basic trimming already done by fast-csv 'trim: true'
        // Check required fields presence (not deep validation)
        const missing = requiredFields.filter((f) => {
          const v = (row[f] ?? "").toString().trim();
          return v === "";
        });

        if (missing.length) {
          parseInvalids.push({ row, reason: `Missing fields: ${missing.join(",")}` });
          return;
        }

        // Push normalized row
        rows.push(row);
      })
      .on("end", (rowCount) => resolve({ rows, parseInvalids, total }));

    // pipe the buffer into csv parser
    stream.write(buffer);
    stream.end();
  });
}
