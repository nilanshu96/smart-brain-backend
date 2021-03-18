const redisClient = require('../database/redis-client');

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    redisClient.get(authorization)
        .then(reply => {
            if (reply) return next();
            return res.status(400).json("Token expired");
        })
        .catch(err => res.status(400).json("Unauthorized"));
}

module.exports = {
    requireAuth: requireAuth
}