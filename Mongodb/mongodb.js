// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// require('./Employee')

// const Employee = mongoose.model('employee')

// app.use(bodyParser.json())
// const mongURI = 'mongodb+srv://thainguyen:123@cluster0.gbnts.mongodb.net/?retryWrites=true&w=majority'
// mongoose.connect(mongURI, {
//     useNewUrlParser: true,
// })

// mongoose.connection.on('connected', () => {
//     console.log('Connect success')
// })

// mongoose.connection.on('error', (err) => {
//     console.log('error', error)
// })

// app.post('/send-data', (req, res) => {
//     const employee = new Employee({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         picture: req.body.picture,
//         salary: req.body.salary,
//         position: req.body.position,
//     })
//     employee.save()
//     .then(data =>{
//         console.log(data)
//         res.send('success')
//         .catch(err =>{
//             console.log(err)
//         })
//     })
// })

// app.get('/', (req, res) => {
//     res.send('welcome to nodejs')
// })

// app.listen(3000, () => {
//     console.log('listening to 3000')
// })