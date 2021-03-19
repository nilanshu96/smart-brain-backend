const jwt = require('jsonwebtoken');

const redisClient = require('../database/redis-client');

const TOKEN_EXPIRE_TIME = 7200;

const setToken = (token, id) => {
    return redisClient.set(token, id);
}

const setTokenExpiry = (token, time = TOKEN_EXPIRE_TIME) => {
    return redisClient.expire(token, time);
}

const createToken = (email) => {
    const payload = { email };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

const createSession = (user) => {

    const { email, id } = user;
    const token = createToken(email);
    return setToken(token, id)
        .then(() => {
            return setTokenExpiry(token);
        })
        .then(() => {
            return { success: 'true', userid: id, token };
        })
        .catch(console.log);
}

const deleteSession = (authToken) => {
    return redisClient.del(authToken);
}

const getAuthInfo = (authorization) => {

    return redisClient.get(authorization)
        .then(reply => {
            if (!reply) {
                return Promise.reject('Auth token expired');
            } else {
                return { id: reply }
            }
        })
        .catch(err => Promise.reject(err));
}

module.exports = {
    createSession,
    deleteSession,
    getAuthInfo
}