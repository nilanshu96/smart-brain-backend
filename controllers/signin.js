const jwt = require('jsonwebtoken');

const redisClient = require('../database/redis-client');

const handleSignIn = (knex, bcrypt, req) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return Promise.reject("Invalid form submission");
    }

    return knex('login')
        .select('email', 'hash')
        .where('email', '=', email)
        .then(user => {
            return bcrypt.compare(password, user[0].hash)
        })
        .then(async same => {
            if (same) {
                try {
                    const users = await knex('users')
                        .select('*')
                        .where('email', '=', email);
                    return users[0];
                } catch (err) {
                    return Promise.reject({ type: 'SIGNIN_ERROR', msg: 'Failed to fetch the user' });
                }
            } else {
                return Promise.reject({ type: 'SIGNIN_ERROR', msg: 'Invalid credentials' });
            }
        })
        .catch(err => {
            if (err.type === 'SIGNIN_ERROR') {
                return Promise.reject(err.msg);
            } else {
                return Promise.reject('failed to login');
            }
        })
}

const setToken = (token, id) => {
    return redisClient.set(token, id);
}

const createToken = (email) => {
    const payload = { email };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

const createSessions = (user) => {

    const { email, id } = user;
    const token = createToken(email);
    return setToken(token, id)
        .then(() => {
            return { success: 'true', userid: id, token };
        })
        .catch(console.log);
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

const signinAuthentication = (knex, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    
    return authorization ?
        getAuthInfo(authorization)
            .then(data => res.json(data))
            .catch(err => {
                res.status(400).json(err);
            }) :
        handleSignIn(knex, bcrypt, req)
            .then(data => {
                return data.id && data.email ? createSessions(data) : Promise.reject(data);
            })
            .then(session => res.json(session))
            .catch(err => {
                res.status(400).json(err)
            });
}

module.exports = {
    signinAuthentication: signinAuthentication
}