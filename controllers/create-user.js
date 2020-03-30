const User = require('../models/User');

const controller = async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  console.log(user);
  res.send(user);
};
module.exports = controller;
