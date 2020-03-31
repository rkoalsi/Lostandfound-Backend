const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    type: {
        type: 'string',
        required: true
    },
    about: {
        type: 'string',
        required: true
    },
    where: {
        type: 'string',
        required: true
    },
    status: {
        type: 'boolean'
    },
    completed: {
        type: 'boolean'
    }
})

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;