const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone_no: String,
    img_url: String,
    img_id: String,
    orders: [String],
    item_in_order: Number,
    cart: String,
    item_in_cart: Number,
    address: [String],
    saved_item_count: {type: Number, default: 0},
    saved_item: [String],
    timestamp: {type: Number, default: Date.now()},
    is_online: {type: Boolean, default: true},
    is_deleted: {type: Boolean, default: false},
    card : [String],    
}, {collection: 'users'});

const model = mongoose.model('User', userSchema);
module.exports = model;