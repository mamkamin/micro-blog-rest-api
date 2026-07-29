const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: 'Unauthorized access'
        });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return res.status(401).json({
            message: 'Unauthorized access'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json(err);
            }
            return res.status(500).json(err);
        }

        if (decoded.id !== req.params.user_id) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }
        console.log("[LOG]:", decoded);
        req.payload = decoded;
        next();
    });
};

module.exports = authenticateJWT;