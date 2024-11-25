const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const JSON_KEY = process.env.JSON_KEY;

function authAdmin(req, res, next) {  
    const token = req.cookies.adminToken;

    if (!token) {
        res.redirect('/login');
    }

    try {
        const admin = jwt.verify(token, JSON_KEY);
        req.admin = admin;
        next(); // Pass control to the next middleware/handler
    } catch (error) {
        console.error(error);
        res.clearCookie('adminToken');
        res.redirect('/login');
    }
}

module.exports = authAdmin;
