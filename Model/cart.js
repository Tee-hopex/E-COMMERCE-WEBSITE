const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    item: [{
        item_name: String,
        color: String,
        item_cost: Number,
        item_img_url: String,
        discounted_cost: Number,
        discount: {type: Number, default: 0},
        total: Number,
        number_ordered: {type: Number,default: 1},
        item_index: Number,
    }],
    
    user_id: String,
    item_in_cart: {type: Number, default: 0},
    discount: {type: Number, default: 0},
    item_cost: {type: Number, default: 0},
    total: {type: Number, default: 0},
    timestamp: {type: Number, default: Date.now()}
    
}, {collection: 'carts'});

const model = mongoose.model('Cart', cartSchema);
module.exports = model;