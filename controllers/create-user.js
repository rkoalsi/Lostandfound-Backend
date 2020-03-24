const User = require('../models/User')

const controller = async (req,res) => {
    const {body} = req;
    const user = await User.create({
        name: body.name,
        email:body.email,
        phone:body.phone
    })
    res.send(user)
}
module.exports = controller