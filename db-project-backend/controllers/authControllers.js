import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User, Role } = db;

export const login = async (req, res) => {
  try {
    const { username, password, verify_role } = req.body;

    if (!username || !password || !verify_role)
      return res
        .status(400)
        .json({ success: false, message: "Missing credentials" });

    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: "Role" }],
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const passwordMatches = password === user.passwordHash;

    if (!passwordMatches)
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });

    // Extract role name from DB
    const roleName = user.Role?.name;

    const mapVerifyRole = (verifyRole) => {
      if (verifyRole === "Administrator") return "admin";
      if (verifyRole === "Police Agent") return "police";
      return "user";
    };

    const expectedRole = mapVerifyRole(verify_role);

    // Role mismatch → reject login
    if (roleName !== expectedRole) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const payload = { id: user.id, username: user.username, role: roleName };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    await user.update({ last_login: new Date() }).catch(() => {});

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: roleName,
        role_id: user.role_id,
      },
    });
  } catch (err) {
    console.error("authController.login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
