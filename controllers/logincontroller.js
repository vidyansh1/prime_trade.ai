const User = require('../model/userschema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  console.log("Login controller called"); // ✅ check if route hits
  console.log("Request body:", req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.render("login", { error: "User not found" , user : null});

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { error: "Invalid password", user : null });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Token ko cookie me set karo
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if https
    });

    // Redirect to tasks page
    return res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Login error" , user : null});
  }
};

module.exports = {
  login
};
