const express = require('express');
const bcrypt = require('bcryptjs'); //allows for encrypting specific data
const jwt = require('jsonwebtoken'); // allows us to generate a new token from a given information entered

require('dotenv').config();

const User = require('../Model/user');
const Cart = require('../Model/cart')

const route = express.Router();


//  endpoint for new item entry
route.post('/add_to_cart', async (req, res) => {
    const {token,item_id, item_name, color,item_cost, item_img_url, discount, number_ordered} = req.body; // Destructuring the request body

    
    // Checking if any required field is missing
    if (!token) return res.status(400).send({status: "Error", msg: "token required"})
    if (!item_name || !item_cost || !color) {
        return res.status(400).send({ "status": "error", "msg": "All required field must be filled" });
    }

    try {
        // percentageCalculator function to help run the calculation
        function percentageCalculator (item_cost, discount, ){
            const discount_amount = (item_cost * (discount / 100))
            return (item_cost - discount_amount)
         }
         const discounted_cost = percentageCalculator(item_cost, discount)
         
         const total = ((discounted_cost * number_ordered))
        
        //token verification
        const user = jwt.verify(token, process.env.JWT_SECRET)
        if(!user) return res.status(400).send({status: "Error", msg: "invalid token"})


        console.log(user._id)
         // check if the cart is empty.
        const count = await Cart.findOne({user_id: user._id});
    if (!count) {
      // create cart document
      const cart = new Cart();
        

      // total number of items in cart
      const item_in_cart = number_ordered;
    
      cart.item.push({
          item_name : item_name,
          item_id : item_id,
          color : color,
          item_cost : item_cost,
          item_img_url : item_img_url || "",
          discount : discount,
          discounted_cost : discounted_cost,
          number_ordered : number_ordered,
          total : total,
      });
      
      cart.item_in_cart = item_in_cart
      cart.user_id = user._id

      // to calculate total item_cost of all the items in the cart
      var calculatedItemCost = 0;
      for (const item of cart.item) {
          calculatedTotal += item.item_cost;
      }
      cart.item_cost = calculatedItemCost;

      // to calculate total total of all the items in the cart
      var calculatedTotal = 0;
      for (const item of cart.item) {
          calculatedTotal += item.total;
      }
      cart.total = calculatedTotal;

      // to calculate total discount of all the items in the cart
      var calculateddiscount = 0;
      for (const item of cart.item) {
          calculatedTotal += item.total;
      }
      cart.discount = calculateddiscount;

      // save my document on mongodb
      await cart.save();
     
      // update user profile
      await User.findByIdAndUpdate(user._id, {
          $set : {cart: cart._id},
          $set : {item_in_cart: item_in_cart}
      });

      return res.status(200).send({status: 'ok', msg: 'success', cart});
    } else if (count) {
        const cart = await Cart.findOne();

        console.log(cart.item.number_ordered)

       
    


      
      cart.item.push({
          item_name : item_name,
          item_id : item_id,
          color : color,
          item_cost : item_cost,
          item_img_url : item_img_url || "",
          discount : discount,
          discounted_cost : discounted_cost,
          number_ordered : number_ordered,
          total : total,
      });

      cart.user_id = user._id
      
      // to calculate total item_in_cart of all the items in the cart
      var calculatedItemInCart = 0;
      for (const item of cart.item) {
        calculatedItemInCart += item.number_ordered;
      }
      cart.item_in_cart = calculatedItemInCart;
                   
      
      // to calculate total item_cost of all the items in the cart
      var calculatedItemCost = 0;
      for (const item of cart.item) {
          calculatedTotal += item.item_cost;
      }
      cart.item_cost = calculatedItemCost;

      // to calculate total total of all the items in the cart
      var calculatedTotal = 0;
      for (const item of cart.item) {
          calculatedTotal += item.total;
      }
      cart.total = calculatedTotal;

      // to calculate total discount of all the items in the cart
      var calculateddiscount = 0;
      for (const item of cart.item) {
          calculatedTotal += item.total;
      }
      cart.discount = calculateddiscount;

      // save my document on mongodb
      await cart.save();
     
      // update user profile
      await User.findByIdAndUpdate(user._id, {
          $set : {cart: cart._id},
          $set : {item_in_cart: calculatedItemInCart}
      });

      return res.status(200).send({status: 'ok', msg: 'success', cart});

      
    }
        
                    
        

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


module.exports = route;