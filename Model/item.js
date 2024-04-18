const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    productname: String,
    productinfo: String,
    number_in_stock: {type: Number, default: 1},
    img_url: [String],
    img_id: [String],
    cart_id: String,
    price: Number,
    reviews: [String],
    rating: number,
    likes: [String],
    like_count: Number,
    discount_percentage: Number,
    timestamp: {type: Number, default: Datenow()},
    is_deleted: {type: Boolean, default: false},
    card_id : [String],    
}, {collection: 'items'});

const model = mongoose.model('Item', itemSchema);
module.exports = model;