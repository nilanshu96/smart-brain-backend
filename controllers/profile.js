const handleProfileGet = (knex) => (req, res) => {

    const { id } = req.params;

    knex('users')
        .select('*')
        .where({
            id: id
        })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('user not found');
            }
        })
        .catch(err => {
            res.status(400).json('unable to fetch the user');
        })
}

const handleProfileEdit = (knex) => (req, res) => {

    const { id } = req.params;

    const { name } = req.body.formInput;

    knex('users')
        .where({ id })
        .update({ name })
        .then(resp => {
            if (resp) {
                res.json("success")
            } else {
                res.status(400).json('user update failed')
            }
        })
        .catch(err => res.status(400).json('error updating user'))
}

module.exports = {
    handleProfileGet: handleProfileGet,
    handleProfileEdit: handleProfileEdit
}