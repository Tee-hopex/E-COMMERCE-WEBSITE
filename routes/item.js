const express = require('express');
const bcrypt = require('bcryptjs'); //allows for encrypting specific data
const jwt = require('jsonwebtoken'); // allows us to generate a new token from a given information entered

require('dotenv').config();

const User = require('../models/user');
const Item = require('../models/item')

const cloudinary = require('../utils/cloudinary');
const uploader = require("../utils/multer");

const route = express.Router();
const {sendPasswordReset, sendOTP} = require('../utils/nodemailer')


//  endpoint for new item entry
route.post('/new_item', uploader.single("image"),  async (req, res) => {
    const { productname, price, productinfo, number_in_stock} = req.body; // Destructuring the request body

    // Checking if any required field is missing
    if (!productname || !price) {
        return res.status(400).send({ "status": "error", "msg": "All field must be filled" });
    }

    try {
        // check if product already exist then
        const found = await Item.findOneAndUpdate({ productname: productname, price: price }, {$inc : {number_in_stock: 1}}, {new:true} ).lean();
       
            // return res.status(400).send({ status: 'error', msg: `User with this username: ${username} already exists` });
            

            let img_url, img_id;
            // check if image was sent in and upload to cloudinary
            if(req.file) {
                // folder is used to specify the folder name you want the image to be saved in
                const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder: 'profile-images'});
                img_url = secure_url;
                img_id = public_id;
            }
            
        // create user document
        const user = new User();
        user.username = username;
        user.password = await bcrypt.hash(password, 10);
        user.phone_no = phone_no;
        user.email = email;
        user.bookmark = [];
        user.img_url = img_url || "";
        user.img_id = img_id || "";
        user.cart_item = [];

        // save my document on mongodb
        await user.save();

        return res.status(200).send({status: 'ok', msg: 'success', user});

    } catch (error) {
        console.error(error);
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
});






module.exports = route;