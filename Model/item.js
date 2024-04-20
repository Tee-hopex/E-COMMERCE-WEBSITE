const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    item_name: String,
    item_description: String,
    number_in_stock: {type: Number, default: 1},
    img_url: [String],
    img_id: [String],
    cart_id: String,
    item_cost: Number,
    color: String,
    reviews: [String],
    rating: Number,
    likes: [String],
    like_count: Number,
    discount_percentage: Number,
    timestamp: {type: Number, default: Date.now()},
    is_deleted: {type: Boolean, default: false},
    card_id : [String],    
}, {collection: 'items'});

const model = mongoose.model('Item', itemSchema);
module.exports = model;