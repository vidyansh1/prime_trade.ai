const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/api/v1/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect("/api/v1/login");
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).send("Only admin can perform this action");
    }
    next();
};
