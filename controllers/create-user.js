const User = require('../models/User')

const controller = async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    })
    res.send(user)
}
module.exports = controller