const mongoose= require("mongoose");
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI)
    .catch(error => console.log('DB Connection error: ' +error));
const con = mongoose.connection;
// handle error when opening db
con.on('open', error => {
    if (!error)
        console.log('DB Connection Successful');
    else
        console.log('Error Connecting to DB: ${error}');
});

// handle mongoose disconnect from mongodb
con.on('disconnected', error => {
    console.log(`Mongoose lost connection with MongoDB:
    ${error}`);
});

const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors")

app.use(cors())

app.get('/paystack', (req, res) => {
    const https = require('https')

const params = JSON.stringify({
  "email" : req.query.email,
  "amount" : req.query.amount
})

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: 'Bearer sk_test_e711e80c4f0858885ed2cea15ab4d3b7f68ea6f5',
    'Content-Type': 'application/json'
  }
}

const reqpaystack = https.request(options, respaystack => {
  let data = ''

  respaystack.on('data', (chunk) => {
    data += chunk
  });

  respaystack.on('end', () => {
    console.log(JSON.parse(data))
    res.send(data)
  })
}).on('error', error => {
  console.error(error)
})

reqpaystack.write(params)
reqpaystack.end()
})

app.use(express.json());

app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
app.use('/cart', require('./routes/cart'))
app.use('/order', require('./routes/order'))
app.use('/address', require('./routes/address'))



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
