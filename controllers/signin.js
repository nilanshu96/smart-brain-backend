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

const signinAuthentication = (knex, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ?
        getAuthInfo() :
        handleSignIn(knex, bcrypt, req)
            .then(data => res.json(data))
            .catch(err => {
                res.status(400).json(err)
            });
}

module.exports = {
    signinAuthentication: signinAuthentication
}