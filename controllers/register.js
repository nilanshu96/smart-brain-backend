const handleRegister = (knex, bcrypt) => (req, res) => {

    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json("Invalid form submission");
    }

    const hash = bcrypt.hashSync(password, 10);

    knex.transaction(async trx => {
        const loginEmail = await trx('login')
            .insert({
                email: email,
                hash: hash
            })
            .returning('email');
        return trx('users')
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .returning('*');
    }).then(users => {
        res.json(users[0])
    }).catch(err => {
        res.status(400).json("unable to register");
    })

}

module.exports = {
    handleRegister: handleRegister
}