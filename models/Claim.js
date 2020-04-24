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
  item_name: {
    type: 'string',
    required: true,
    ref: 'Item'
  },
  item_about: {
    type: 'string',
    required: true,
    ref: 'Item'
  },
  item_id: {
    type: 'string',
    required: true,
    ref: 'Item'
  },
  date: {
    type: Date,
    default: new Date()
  }
});

const Claim = mongoose.model('Claim', ClaimSchema);
module.exports = Claim;
