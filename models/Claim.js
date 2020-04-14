const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true
  },
  number: {
    type: 'number',
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  },
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  about: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }
});

const Claim = mongoose.model('Claim', ClaimSchema);
module.exports = Claim;
