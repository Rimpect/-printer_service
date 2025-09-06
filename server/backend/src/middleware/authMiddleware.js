const jwt = require("jsonwebtoken");
const { query } = require("../config/database");
module.exports = async (req, res, next) => {
  try {
    console.log("[authMiddleware] Headers:", req.headers); // Логируем заголовки

    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(
      "[authMiddleware] Extracted token:",
      token ? "exists" : "missing"
    );

    if (!token) {
      console.log("[authMiddleware] No token provided");
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("[authMiddleware] Decoded token:", decoded);

    const { rows } = await query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);
    if (rows.length === 0) {
      console.log("[authMiddleware] User not found in DB");
      return res.status(401).json({ error: "User not found" });
    }

    req.user = rows[0];
    console.log("[authMiddleware] Authenticated user:", req.user.id);
    next();
  } catch (error) {
    console.error("[authMiddleware] Error:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    res.status(401).json({ error: "Please authenticate" });
  }
};
