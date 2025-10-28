// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
const { User, Role } = db;

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Response: { token, user: { id, username, role } }
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: "Missing credentials" });

    // Find user and include Role to get role name
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: "Role" }],
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches)
      return res.status(401).json({ success: false, message: "Invalid username or password" });

    // role name
    const roleName = user.Role?.name || "public";

    // Build token payload
    const payload = { id: user.id, username: user.username, role: roleName };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6h" });

    // Update last_login (best effort; ignore error)
    try {
      await user.update({ last_login: new Date() });
    } catch (err) {
      // ignore
    }

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, role: roleName, role_id: user.role_id },
    });
  } catch (err) {
    console.error("authController.login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
