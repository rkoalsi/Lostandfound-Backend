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
  item_name: {
    type: 'string',
    ref: 'Item'
  }
});

const Claim = mongoose.model('Claim', ClaimSchema);
module.exports = Claim;
