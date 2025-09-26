const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/api/v1/login");

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.redirect("/api/v1/login");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).send("Only admin can perform this action");
  next();
};
