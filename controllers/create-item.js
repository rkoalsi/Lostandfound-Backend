const Item = require('../models/Item');

const controller = async (req, res) => {
  const item = await Item.create({
    Item: req.body.Item
  });
  res.send(item);
};

module.exports = controller;
