// controllers/crimeController.js
import { Op, fn, col, literal } from "sequelize";
import db from "../models/index.js";
const { Crime, User, Criminal } = db;

// ===================================================
// 🔍 SEARCH CRIMES
// ===================================================
export const searchCrimes = async (req, res) => {
    try {
        const { role } = req.user;
        const {
            crime_type_id,
            start_date,
            end_date,
            zone_id,
            case_id,
            officer_name,
            officer_id,
            person_name,
        } = req.query;

        const whereClause = {};

        // 🔹 Common filters
        if (crime_type_id) whereClause.crime_type_id = crime_type_id;
        if (zone_id) whereClause.zone_id = zone_id;
        if (start_date && end_date) {
            whereClause.date = { [Op.between]: [new Date(start_date), new Date(end_date)] };
        }

        // 🔸 Admin & Police-only filters
        if (["admin", "police"].includes(role)) {
            if (case_id) whereClause.id = case_id;
            if (officer_id) whereClause.officer_id = officer_id;
            if (officer_name) whereClause["$User.name$"] = { [Op.iLike]: `%${officer_name}%` };
            if (person_name) whereClause["$Criminal.name$"] = { [Op.iLike]: `%${person_name}%` };
        }

        // 🚫 Restrict Public users from sensitive filters
        if (role === "public" && (case_id || officer_id || officer_name || person_name)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized filters for public users.",
            });
        }

        // 🔍 Execute query
        const crimes = await Crime.findAll({
            where: whereClause,
            include: [
                { model: User, attributes: ["id", "name"], required: false },
                { model: Criminal, as: "criminals", attributes: ["id", "name"], required: false },
            ]
            ,
        });

        res.status(200).json({ success: true, data: crimes });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, message: "Error searching crimes" });
    }
};

// ===================================================
// ➕ ADD CRIME
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
// ✏️ UPDATE CRIME
// ===================================================
export const updateCrime = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, crime_type_id, date, location, address, zone_id, status } = req.body;

        const crime = await Crime.findByPk(id);
        if (!crime) {
            return res.status(404).json({ success: false, message: "Crime not found" });
        }

        // Build update data dynamically
        const updateData = { title, description, crime_type_id, date, address, zone_id, status };

        if (location && location.lat && location.lng) {
            updateData.location = literal(`ST_SetSRID(ST_Point(${location.lng}, ${location.lat}), 4326)`);
        }

        await crime.update(updateData);

        res.status(200).json({ success: true, message: "Crime updated successfully", data: crime });
    } catch (error) {
        console.error("Update Crime Error:", error);
        res.status(500).json({ success: false, message: "Error updating crime" });
    }
};

// ===================================================
// ❌ DELETE CRIME
// ===================================================
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
