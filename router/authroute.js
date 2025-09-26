const express = require("express");
const router = express.Router();
const signup = require("../controllers/signupcontroller");
const login= require("../controllers/logincontroller");
const logout= require("../controllers/logoutcontroller");

// render the forms
router.get("/signup", (req, res) => {
    res.render("signup", { user: req.user || null });
});
 router.get("/login", (req, res) => {
    res.render("login", { user: req.user || null });
});
// Signup route
router.post("/signup", signup.signup);

// Login route
router.post("/login", login.login);
// logout route
router.get("/logout", logout.logout);

module.exports = router;
