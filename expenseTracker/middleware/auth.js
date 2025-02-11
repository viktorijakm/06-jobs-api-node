// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }


        console.log("Decoded Token:", decoded);



        // Attach user data to the request object
        req.user = { userId:decoded.userId };
        
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = verifyToken;
