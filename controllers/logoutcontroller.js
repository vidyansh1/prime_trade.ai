const session = require("express-session");

const logout = (req,res) => {
    res.clearCookie("token");
    res.redirect('/');
}
module.exports = {
    logout
}