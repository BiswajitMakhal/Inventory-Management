const User = require("../models/user");
const Jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const statusCode = require("../helper/statusCode");

class UserAuthController {
  async registerView(req, res) {
    res.render("register");
  }
  async loginView(req, res) {
    res.render("login");
  }
  async registerUser(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Email already registered.",
        });
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "User",
      });

      return res.redirect("/login");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        user: err.message,
      });
    }
  }
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "user is not found",
        });
      }
      if (user.isLocked) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "your id isLocked",
        });
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
          user.isLocked = true;
        }
      }
      user.failedLoginAttempts = 0;

      await user.save();

      const token = Jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );
      res.cookie("token", token);

      // Role
      if (user.role === "Admin") {
        return res.redirect("/dashboard");
      } else {
        return res.redirect("/home");
      }
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        succeess: false,
        message: err.message,
      });
    }
  }
  async logout(req, res) {
    res.clearCookie("token");
    res.redirect("/login");
  }
}

module.exports = new UserAuthController();
