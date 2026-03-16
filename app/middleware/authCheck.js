const jwt = require("jsonwebtoken");

const AuthCheck = (req, res, next) => {
  if (req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        res.clearCookie("token");
        return res.redirect("/login");
      }

      req.user = data;
      console.log("Logged in User:", req.user);

      next();
    });
  } else {
    return res.redirect("/login");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.redirect("/home");
  }
};

const isUser = (req, res, next) => {
  if (req.user && req.user.role === "User") {
    next();
  } else {
    return res.redirect("/home");
  }
};

module.exports = { AuthCheck, isAdmin,isUser };
