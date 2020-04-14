const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true
  },
  email: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;