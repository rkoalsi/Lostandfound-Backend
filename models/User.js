const mongoose = require('mongoose');
require('mongoose-type-email');
const mongooseTypePhone = require('mongoose-type-phone');

mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';

const UserSchema = new mongoose.Schema({
  name: { type: 'string', required: true },
  email: { email: mongoose.SchemaTypes.Email },
  phone: {
    type: mongoose.SchemaTypes.Phone,
    required: 'Phone number should be 10 digits',
    allowBlank: false,
    allowedNumberTypes: [
      mongooseTypePhone.PhoneNumberType.MOBILE,
      mongooseTypePhone.PhoneNumberType.FIXED_LINE_OR_MOBILE
    ],
    phoneNumberFormat: mongooseTypePhone.PhoneNumberFormat.INTERNATIONAL,
    defaultRegion: 'IN',
    parseOnGet: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.Model('User', UserSchema);
module.exports = User;
