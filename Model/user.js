const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone_no: String,
    img_url: String,
    img_id: String,
    cart_id: String,
    bookmark_count: {type: Number, default: 0},
    bookmark: [String],
    timestamp: {type: Number, default: Date.now()},
    is_online: {type: Boolean, default: true},
    is_deleted: {type: Boolean, default: false},
    card_id : [String],    
}, {collection: 'users'});

const model = mongoose.model('User', userSchema);
module.exports = model;