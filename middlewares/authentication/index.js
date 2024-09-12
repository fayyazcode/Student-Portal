const { resWrapper } = require("../../utils");
const jwt = require("jsonwebtoken")

const secretKey = process.env.JWT_SECRET_KEY
const jwtAuthentication = (req, res, next) => {
    // Extract token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send(resWrapper("Token Not Available", 401, null, "Please Provide Authorization Token")); // If no token is provided

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send(resWrapper("Unauthorized User", 403, null, "Unauthorized")); // If token is invalid

        req.email = user.email; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
};


module.exports = { jwtAuthentication }