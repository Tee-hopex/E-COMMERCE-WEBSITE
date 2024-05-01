const express = require('express');
const jwt = require('jsonwebtoken'); 

require('dotenv').config();

const User = require('../models/user');
const Order = require('../models/order')
const Cart = require('../models/cart')

const route = express.Router();

//  endpoint for new item entry
route.post('/place_order', async (req, res) => {
    const { token, cart_id, delivery_fee} = req.body; // Destructuring the request body

    if (!token) return res.status(400).send({status: "Error", msg: "token required"});
    // Checking if any required field is missing
    if (!cart_id, !delivery_fee) {
        return res.status(400).send({ "status": "error", "msg": "All required field must be filled" });
    };

    try {
        //token verification
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if(!user) return res.status(400).send({status: "Error", msg: "invalid token"});
            
        const cart = await Cart.findById(cart_id);

        const total = cart.total + delivery_fee;
                       
        // create order document
        const order = new Order();
        order.user_id = user._id;
        order.cart_id = cart_id;
        order.items = cart.item;
        order.delivery_fee = delivery_fee;
        order.item_cost = cart.item_cost;
        order.discount = cart.discount;
        order.item_in_cart = cart.item_in_cart;
        order.total = total;
        
        // save my document on mongodb
        await order.save();

        await User.findByIdAndUpdate(user._id, {
            $push : {orders: order._id},
            $inc : {order_count: 1}
        });

        // clear the user cart for new order placements
        await Cart.findByIdAndDelete(cart_id)

        return res.status(200).send({status: 'ok', msg: 'success', order});

    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
});

// endpoint to remove from cart
route.post('/remove', async(req, res) => {
    const {token, cart_id, item_id} = req.body;

    // Checking if any required field is missing
    if (!token) return res.status(400).send({status: "Error", msg: "token required"})
    if (!cart_id || !item_id) {
        return res.status(400).send({ "status": "error", "msg": "All required field must be filled" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        const cart = await Cart.findByIdAndUpdate(cart_id, {$pull: {item: {_id : item_id}}, $inc: {item_in_cart: -1}}, {new: true})

        return res.status(200).send({status: "success", msg: "item removed from cart", cart})

    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }

})

// endpoint to cancel order
route.post('/cancel_order', async (req, res) => {
    const {order_id, token} = req.body;

    if (!token) return res.status(400).send({status: "Error", msg: "token required for action"});
    if (!order_id) return res.status(400).send({status: "Error", msg: "order_id required for action"});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status({status: "Error", msg: "invalid token"});

        const order = await Order.findByIdAndUpdate(order_id, {$set :{order_status : "cancelled" }}, {new:true});

        await User.findByIdAndUpdate(user_id, {$pull : {orders: order_id}, $inc : {order_count: -1}});

        return res.status(200).send({status: "Success", msg: "Order cancelled successfully", order});

        
    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})

// endpoint to delivered order
route.post('/delivered_order', async (req, res) => {
    const {order_id, token} = req.body;

    if (!token) return res.status(400).send({status: "Error", msg: "token required for action"});
    if (!order_id) return res.status(400).send({status: "Error", msg: "order_id required for action"});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status({status: "Error", msg: "invalid token"});

        const order = await Order.findByIdAndUpdate(order_id, {$set :{order_status : "delivered" }}, {new:true})

        // await User.findByIdAndUpdate(user_id, {$pull : {orders: order_id}, $inc : {item_in_order: -1}})

        return res.status(200).send({status: "Success", msg: "Order delivered successfully", order})

        
    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})

// endpoint for viewing pending order
route.post('/view_pending_order', async (req, res) => {
    const {order_id, token} = req.body;

    if (!token) return res.status(400).send({status: "Error", msg: "token required for action"});
    if (!order_id) return res.status(400).send({status: "Error", msg: "order_id required for action"});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status({status: "Error", msg: "invalid token"});

        const order = await Order.find({order_status: "pending"})

        return res.status(200).send({status: "Success", msg: "Your pending orders are", order})

        
    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})

// endpoint for viewing cancelled order
route.post('/view_cancelled_order', async (req, res) => {
    const {order_id, token} = req.body;

    if (!token) return res.status(400).send({status: "Error", msg: "token required for action"});
    if (!order_id) return res.status(400).send({status: "Error", msg: "order_id required for action"});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status({status: "Error", msg: "invalid token"});

        const order = await Order.find({order_status: "cancelled"})

        return res.status(200).send({status: "Success", msg: "Your cancelled orders are", order})

        
    } catch (error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(400).send({status: 'error', msg: 'Token verification failed'});
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
})

// endpoint for viewing delivered order
route.post('/view_delivered_order', async (req, res) => {
    const {order_id, token} = req.body;

    if (!token) return res.status(400).send({status: "Error", msg: "token required for action"});
    if (!order_id) return res.status(400).send({status: "Error", msg: "order_id required for action"});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status({status: "Error", msg: "invalid token"});

        const order = await Order.find({order_status: "delivered"})

        return res.status(200).send({status: "Success", msg: "Your delivered orders are", order})

        
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