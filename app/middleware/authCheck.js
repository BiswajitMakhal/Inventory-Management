const jwt = require("jsonwebtoken");
const statusCode = require('../helper/statusCode')

const AuthCheck = async (req, res, next) => {
  const token =
    req.body?.token ||
    req.query?.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  if (!token) {
    return res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Token is required authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, proccess.env.JWT_SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
  }

  return next();
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(statusCode.FORBIDDEN).json({
      success: false,
      message: "You are not authorized",
    });
  }
};

module.exports = { AuthCheck, isAdmin };
