// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "default_super_secret_key";

const authenticateToken = (req, res, next) => {
    // Ստանում ենք Authorization header-ը
    const authHeader = req.headers["authorization"];
    
    // Ստուգում ենք՝ արդյոք այն գոյություն ունի և ճիշտ ֆորմատով է ("Bearer TOKEN")
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        // Վավերացնում ենք թոքենը
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Կցում ենք օգտատիրոջ տվյալները հարցմանը (JS-ում ինտերֆեյս պետք չէ)
        req.user = decoded;
        
        // Անցնում ենք հաջորդ ֆունկցիային
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = { authenticateToken };