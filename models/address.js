const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    
    username: String,
    user_id: String, 
    total_address: {type: Number, default: 1},
    addresses: [
        {
            phone_no: String,
            location: String,
            city: String,
            state: String,
        }
    ],
    
    timestamp: {type: Number, default: Date.now()},
}, {collection: 'address'});

const model = mongoose.model('Address', addressSchema);
module.exports = model;