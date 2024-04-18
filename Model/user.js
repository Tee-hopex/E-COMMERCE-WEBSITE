const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone_no: String,
    img_url: String,
    img_id: String,
    // pending_order: [String],
    // delivered_order: [String],
    // cancelled_order: [String],
    cart_item: [String],
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