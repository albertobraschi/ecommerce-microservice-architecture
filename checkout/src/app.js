var express = require('express');

// Constants
const PORT = 8080;

// App
var app = express();

// Setup body-parser for POST parameters retrieval
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Routes
var indexRoutes = require('./routes/index');
var checkoutRoutes = require('./routes/checkout');
app.use('/', indexRoutes);
app.use('/checkout', checkoutRoutes);

// Start webserver
app.listen(PORT);
console.log('Hamaca checkout microservice is now running on port: ' + PORT);
