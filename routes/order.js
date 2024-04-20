const express = require('express');
const bcrypt = require('bcryptjs'); //allows for encrypting specific data
const jwt = require('jsonwebtoken'); // allows us to generate a new token from a given information entered

require('dotenv').config();

const User = require('../Model/user');
const Order = require('../Model/order')

// const cloudinary = require('../utils/cloudinary');
// const uploader = require("../utils/multer");

const route = express.Router();
// const {sendPasswordReset, sendOTP} = require('../utils/nodemailer')


//  endpoint for new item entry
route.post('/place_order', async (req, res) => {
    const { token,item_id, item_name, color,item_cost, item_img_url ,delivery_fee, discount, number_ordered, } = req.body; // Destructuring the request body

    if (!token) return res.status(400).send({status: "Error", msg: "token required"})
    // Checking if any required field is missing
    if (!item_name || !item_id || !item_cost || !delivery_fee || !color ||item_img_url) {
        return res.status(400).send({ "status": "error", "msg": "All required field must be filled" });
    }

    try {
        // percentageCalculator function to help run the calculation
        function percentageCalculator (item_cost, discount, ){
            const discount_amount = (item_cost * (discount / 100))
            return (item_cost - discount_amount)
         }
         const discounted_cost = percentageCalculator(item_cost, discount)
         const total = ((discounted_cost * number_ordered) - delivery_fee)
        
        //token verification
        const user = jwt.verify(token, process.env.JWT_SECRET)
        if(!user) return res.status(400).send({status: "Error", msg: "invalid token"})
            
        // create order document
        const order = new Order();
        order.user_id = user._id;
        order.item_name = item_name;
        order.item_id = item_id;
        order.color = color;
        order.item_cost = item_cost;
        order.item_img_url = item_img_url || "";
        order.item_img_id = item_img_id || "";
        order.discount = discount;
        order.discounted_cost = discounted_cost; 
        order.delivery_fee = delivery_fee;          
        order.number_ordered = number_ordered;
        order.total = total;

        // save my document on mongodb
        await order.save();

        await User.findByIdAndUpdate(user._id, {
            $push : {orders: order._id},
            $inc : {item_in_order: 1}
        });

        return res.status(200).send({status: 'ok', msg: 'success', order});

    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
});

// endpoint to cancel order
route.post('/cancel_order', async (req, res) => {
    const {order_id, token} = req.body;

    if (!token) return res.status(400).send({status: "Error", msg: "token required for action"});
    if (!order_id) return res.status(400).send({status: "Error", msg: "order_id required for action"});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status({status: "Error", msg: "invalid token"});

        const order = await Order.findByIdAndUpdate(order_id, {$set :{order_status : "cancelled" }}, {new:true})

        await User.findByIdAndUpdate(user_id, {$pull : {orders: order_id}, $inc : {item_in_order: -1}})

        return res.status(200).send({status: "Success", msg: "Order cancelled successfully", order})

        
    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})

// endpoint for delivered order
route.post('/delivered_order', async (req, res) => {
    const {order_id, token} = req.body;

    if (!token) return res.status(400).send({status: "Error", msg: "token required for action"});
    if (!order_id) return res.status(400).send({status: "Error", msg: "order_id required for action"});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status({status: "Error", msg: "invalid token"});

        const order = await Order.findByIdAndUpdate(order_id, {$set :{order_status : "cancelled" }}, {new:true})

        await User.findByIdAndUpdate(user_id, {$pull : {orders: order_id}, $inc : {item_in_order: -1}})

        return res.status(200).send({status: "Success", msg: "Order cancelled successfully", order})

        
    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})




module.exports = route;