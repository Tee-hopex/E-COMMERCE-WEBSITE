const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: String,
    item_name: String,
    item_id: String,
    color: String,
    item_cost: Number,
    item_img_url: String,
    item_img_id: String,
    discounted_cost: Number,
    discount: {type: Number, default: 0},
    delivery_fee: Number,
    total: Number,
    number_ordered: {type: Number,default: 1},
    paid: {type: Boolean, default: false},
    order_status: {type: String, enum : ["pending", "delivered", "cancelled"], default: "pending"},
    timestamp: {type: Number, default: Date.now()}
    
}, {collection: 'orders'});

const model = mongoose.model('Order', orderSchema);
module.exports = model;