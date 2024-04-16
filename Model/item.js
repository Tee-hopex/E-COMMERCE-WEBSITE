const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    productname: String,
    img_url: String,
    img_id: String,
    cart_id: String,
    cart_item: [String],
    price: Number,
    rating: number,
    likes: [String],
    like_count: Number,
    discount_percentage: Number,
    timestamp: {type: Number, default: Datenow()},
    is_deleted: {type: Boolean, default: false},
    card_id : [String],    
}, {collection: 'items'});

const model = mongoose.model('Item', userSchema);
module.exports = model;