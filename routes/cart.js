const express = require('express');
const jwt = require('jsonwebtoken'); // allows us to generate a new token from a given information entered

require('dotenv').config();

const User = require('../models/user');
const Cart = require('../models/cart')

const route = express.Router();

//  endpoint for new item entry
route.post('/add_to_cart', async (req, res) => {
    const {token,item_name, color,item_cost, item_img_url, discount, number_ordered} = req.body; // Destructuring the request body
    
    // Checking if any required field is missing
    if (!token) return res.status(400).send({status: "Error", msg: "token required"})
    if (!item_name || !item_cost || !color) {
        return res.status(400).send({ "status": "error", "msg": "All required field must be filled" });
    }

    if (discount) {
       dist = discount
    } 
    if (!discount) {
       dist = 0
    }

    try {
        // percentageCalculator function to help run the calculation
        function percentageCalculator (item_cost, dist, ){
            const discount_amount = (item_cost * (dist / 100))
            return (item_cost - discount_amount)
         }
         const discounted_cost = percentageCalculator(item_cost, dist)
         
         const total = ((discounted_cost * number_ordered))
        
        //token verification
        const user = jwt.verify(token, process.env.JWT_SECRET)
        if(!user) return res.status(400).send({status: "Error", msg: "invalid token"})


         // check if the Cart is empty.
        const check = await Cart.findOne({user_id: user._id});
    if (!check) {
      // create cart document
      const cart = new Cart();        

      // total number of items in cart
      const item_in_cart = number_ordered;
    
      cart.item.push({
          item_name : item_name,
          color : color,
          item_cost : item_cost * number_ordered,
          item_img_url : item_img_url || "",
          discount : dist,
          discounted_cost : discounted_cost,
          number_ordered : number_ordered,
          total : total,
      });
      
      cart.item_in_cart = item_in_cart
      cart.user_id = user._id

      // to calculate total item_cost of all the items in the cart
      var calculatedItemCost = 0;
      for (const item of cart.item) {
        calculatedItemCost += item.item_cost;
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
        calculateddiscount += item.discount;
      }
      cart.discount = calculateddiscount;

      // save my document on mongodb
      await cart.save();

    //   console.log(cart._id)
     
      // update user profile
      await User.findByIdAndUpdate(user._id, {
          $set : {item_in_cart: item_in_cart},
          $set : {cart: cart._id}
      });

      return res.status(200).send({status: 'ok', msg: 'success', cart});
    } else if (check) {
        const cart = await Cart.findOne({user_id: user._id});
            
      cart.item.push({
          item_name : item_name,
          color : color,
          item_cost : item_cost * number_ordered,
          item_img_url : item_img_url || "",
          discount : dist,
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
        calculatedItemCost += item.item_cost;
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
        calculateddiscount += item.discount;
      }
      cart.discount = calculateddiscount;

      // save my document on mongodb
      await cart.save();
     
      // update user profile
      await User.findByIdAndUpdate(user._id, {
          $set : {item_in_cart: calculatedItemInCart}
      });

      return res.status(200).send({status: 'ok', msg: 'success', cart});

      
    } else { return res.status(200).send({status: "Error", msg: "Error Occurred from my check"})}
        
                    
        

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

// endpoint to view cart
route.post('/view_cart', async(req, res) => {
  const {token} = req.body;

  // Checking if any required field is missing
  if (!token) return res.status(400).send({status: "Error", msg: "token required"})
  
  try {
      const user = jwt.verify(token, process.env.JWT_SECRET);

      const profile = await User.findById(user._id)

      const cart = await Cart.findById(profile.cart)

      return res.status(200).send({status: "success", msg: "user cart is", cart})

  } catch (error) {
      console.error(error);
      // Sending error response if something goes wrong
      res.status(500).send({ "status": "some error occurred", "msg": error.message });
  }

})


module.exports = route;