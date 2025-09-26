const express = require("express");
const router = express.Router();
const signup = require("../controllers/signupcontroller");
const login = require("../controllers/logincontroller");
const logout = require("../controllers/logoutcontroller");
const jwt = require("jsonwebtoken");

// Render signup/login forms with user if logged in
router.get("/signup", (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try { user = jwt.verify(token, process.env.JWT_SECRET); } 
    catch (err) { user = null; }
  }
  res.render("signup", { user });
});

router.get("/login", (req, res) => {
  const token = req.cookies.token;
  let user = null;
  if (token) {
    try { user = jwt.verify(token, process.env.JWT_SECRET); } 
    catch (err) { user = null; }
  }
  res.render("login", { user, error: null });
});

// Auth APIs
router.post("/signup", signup.signup);
router.post("/login", login.login);
router.get("/logout", logout.logout);

module.exports = router;
