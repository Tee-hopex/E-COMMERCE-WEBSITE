const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: String,
    cart_id: String,
    items: [Object],
    delivery_fee: Number,
    item_cost: Number,
    discount: {type: Number, default: 0},
    total: Number, 
    paid: {type: Boolean, default: false},
    order_status: {type: String, enum : ["pending", "delivered", "cancelled"], default: "pending"},
    timestamp: {type: Number, default: Date.now()}
    
}, {collection: 'orders'});

const model = mongoose.model('Order', orderSchema);
module.exports = model;