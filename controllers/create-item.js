const Item = require('../models/Item');

const controller = async (req, res) => {
  const item = await Item.create({
    name: req.body.name,
    type: req.body.type,
    about = req.body.about,
    where = req.body.where,
  });
  res.send(item);
};

module.exports = controller;