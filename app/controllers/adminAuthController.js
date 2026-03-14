const Admin = require("../models/admin");
const Jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const statusCode = require("../helper/statusCode");

class AdminAuthController {
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "admin is not found",
        });
      }
      if (admin.isLocked) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "your id isLocked",
        });
      }
      const isMatch = await bcryptjs.compare(password, admin.password);
      if (!isMatch) {
        admin.failedLoginAttempts += 1;
        if (admin.failedLoginAttempts >= 5) {
          admin.isLocked = true;
        }
      }
      admin.failedLoginAttempts = 0;

      await admin.save();

      const token = Jwt.sign(
        {
          id: admin._id,
          role: admin.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );

      return res.status(statusCode.Ok).json({
        succeess: true,
        message: "login successfully",
        token: token,
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        succeess: false,
        message: err.message,
      });
    }
  }
}

module.exports = new AdminAuthController();
