const handleSignIn = (knex, bcrypt) => (req, res) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json("Invalid form submission");
    }

    knex('login')
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
                    res.json(users[0]);
                } catch (err) {
                    res.status(400).json('Failed to fetch the user');
                }
            } else {
                res.status(400).json('Invalid credentials');
            }
        })
        .catch(err => {
            res.status(400).json('failed to login');
        })
}

module.exports = {
    handleSignIn: handleSignIn
}