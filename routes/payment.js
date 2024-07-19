// const express = require("express");
// const app = express();


// app.get('/payment', () =>{
//     const https = require('https')

// const params = JSON.stringify({
//   "email": "customer@email.com",
//   "amount": "20000"
// })

// const options = {
//   hostname: 'api.paystack.co',
//   port: 443,
//   path: '/transaction/initialize',
//   method: 'POST',
//   headers: {
//     Authorization: 'Bearer sk_test_e711e80c4f0858885ed2cea15ab4d3b7f68ea6f5',
//     'Content-Type': 'application/json'
//   }
// }

// const reqpaystack = https.request(options, respaystack => {
//   let data = ''

//   respaystack.on('data', (chunk) => {
//     data += chunk
//   });

//   respaystack.on('end', () => {
//     console.log(JSON.parse(data))
//   })
// }).on('error', error => {
//   console.error(error)
// })

// reqpaystack.write(params)
// reqpaystack.end()
// })