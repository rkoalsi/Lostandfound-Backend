const mongoose = require('mongoose');
const mongooseTypePhone = require('mongoose-type-phone');

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true
  },
  email: {
    type: 'string',
    required: true
  },
  phone: {
    type: "number",
    required: true
  },
  date: {
    type: Date,
    default: Date.now.toString()
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;