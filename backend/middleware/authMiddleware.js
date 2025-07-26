const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // ✅ Log incoming Authorization header
  console.log("Incoming token:", req.headers.authorization);

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(403).json({ message: "User not found" });
      }

      // ✅ Optional: log user info
      console.log("Authenticated user:", req.user);

      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(403).json({ message: "Token failed", error: error.message });
    }
  } else {
    return res.status(403).json({ message: "No token, authorization denied" });
  }
};

module.exports = { protect };
