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
    // this was throwing an error, there is no such method as Date().now.toString(), just use new Date(), when storing it into db it automatically gets serialized to string date
    default: new Date()
  }
});

UserSchema.statics.createUser = async function(params) {
  const { name, email, phone, password } = params;
  const user = await this.create({ name, email, phone, password });
  return user.toJSON();
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
