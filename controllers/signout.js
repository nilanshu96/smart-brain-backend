const { deleteSession } = require('../util/session-manager');

const handleSignOut = (req, res) => {

    const { authorization } = req.headers;

    if (!authorization || authorization == "null" || authorization == "undefined") {
        return res.status(400).json("No Auth token present");
    }

    return deleteSession(authorization)
        .then(reply => {
            if (reply) {
                return res.json("Signout Successful")
            } else {
                return res.status(400).json("Invalid Auth token")
            }
        })
        .catch(err => {
            return res.status(400).json("Server error while signing out");
        })
}

module.exports = {
    handleSignOut: handleSignOut
}
