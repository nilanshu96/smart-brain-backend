const jwt = require('jsonwebtoken');

const redisClient = require('../database/redis-client');

const setToken = (token, id) => {
    return redisClient.set(token, id);
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