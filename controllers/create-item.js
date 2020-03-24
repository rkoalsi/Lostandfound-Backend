const Item = require('../models/Item');

const controller = async (req,res) =>{
    const {body} = req;
    const item = await Item.create({
        Item: body.Item
    })
    res.send(item)
}

module.exports = controller