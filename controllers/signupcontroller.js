const User = require('../model/userschema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", { user: null, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 16);

    // role ko user de sakta hai (default 'user' rahega schema se)
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // ✅ ab token me proper role jaa raha hai
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/tasks");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = { signup };
