const express = require('express');
const jwt = require('jsonwebtoken'); 

require('dotenv').config();

const User = require('../models/user');
const Address = require('../models/address');

const route = express.Router();

//  new Address
route.post('/new_address', async (req, res) => {
    const {token, phone_no, location, city, state} = req.body; // Destructuring the request body

    if (!token) return res.status(400).send({status: "Error", msg: "token required"})
    // Checking if any required field is missing
    if (!phone_no || !location || !city || !state) {
        return res.status(400).send({ "status": "error", "msg": "All field must be filled" });
    }

    try {

        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status(400).send({status: "Error", msg: "token verification error"})
 
         // check if the user already have an address document
         const check = await Address.findOne({user_id: user._id});
         if (!check) {

            // create user document
        const address = new Address();              
     
        address.username = user.username;
        address.user_id = user._id;
        address.addresses.push({
            phone_no: phone_no,
            location: location,
            city: city,
            state: state
        })        
        
        // save my document on mongodb
        await address.save();

        await User.findByIdAndUpdate(user._id, {
           $set : {address: address._id}
        });

        return res.status(200).send({status: 'ok', msg: 'success', address});
    } 
    const address = await Address.findOne({user_id: user._id});

        address.addresses.push({
            phone_no: phone_no,
            location: location,
            city: city,
            state: state
        })         
        const number = address.addresses.length
        address.total_address = number;
        
        // save my document on mongodb
        await address.save();

        return res.status(200).send({status: 'ok', msg: 'success', address});

    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }

});

// edit address
route.post('/edit', async(req, res) => {
    const {token, address_id, _id, phone_no, location, city, state} = req.body;

    // Checking if any required field is missing
    if (!token) return res.status(400).send({status: "Error", msg: "token required"})
    if (!address_id, !_id) {
        return res.status(400).send({ "status": "error", "msg": "All required field must be filled" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        const address = await Address.findById(address_id)
        if (!address) {
        return res.status(400).send({status: "Error", msg: 'Address not found' });
        }

        // Find the address within the addresses array using its _id
        const updatedAddress = address.addresses.find(addr => addr._id.equals(_id));

        if (!updatedAddress) {
        return res.status(400).send({status: "Error", msg: 'Address not found in the array' });
        }

        // Update the address properties
        updatedAddress.phone_no = phone_no;
        updatedAddress.location = location;
        updatedAddress.city = city;
        updatedAddress.state = state;

        // Save the updated address document
        await address.save();

        return res.status(200).send({status: "success", msg: "address has been updated", address})


    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }

})

// view addresses
route.post('/view', async(req, res) => {
    const {token} = req.body;

    // Checking if any required field is missing
    if (!token) return res.status(400).send({status: "Error", msg: "token required"})
    
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) return res.status(400).send({status: "Error", msg: "Invalid token"})

        const profile = await User.findById(user._id);
        if (!profile) return res.status(400).send({status: "Error", msg: "User does not exist"})

        const address = await Address.findById(profile.address)
        if (!address) {
        return res.status(400).send({status: "Error", msg: 'Address not found' });
        }
        const addr = address.addresses
        
        return res.status(200).send({status: "success", msg: "these are your addresses", addr})


    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }

})

module.exports = route;