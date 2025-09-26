const User = require('../model/userschema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", { error: "User already exists", user: null });
        }

        const hashedPassword = await bcrypt.hash(password, 16);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'  // agar role nahi diya to default 'user'
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, name: newUser.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true });
        return res.redirect("/tasks");

    } catch (error) {
        console.error(error);
        res.render("signup", { error: "Server error", user: null });
    }
};

module.exports = { signup };
