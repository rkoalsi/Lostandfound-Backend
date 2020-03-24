const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    Item: {type:'string', required:'true'},
    // ID: {type:'ObjectId'}
})

const Item = mongoose.Model('Item',ItemSchema);

module.exports = Item;