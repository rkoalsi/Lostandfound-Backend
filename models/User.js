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
  phone: {
    type: 'number'
  },
  password: {
    type: 'string',
    required: true
  },
  date: {
    type: Date,
    default: Date.now.toString()
  }
});

UserSchema.statics.createUser = async function(params) {
  const { name, email, phone, password } = params;
  const user = await this.create({ name, email, phone, password });
  return user.toJSON();
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
