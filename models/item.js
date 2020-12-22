const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    availableQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    detail: {
        type: String,
        required: false
    },
    vendorName: {
        type: String,
        required: false
    }
},{
    timestamps: true
})

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;