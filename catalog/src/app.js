var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();

// Setup body-parser for POST parameters retrieval
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Routes
var indexRoutes = require('./routes/index');
var productsRoutes = require('./routes/products');
app.use('/', indexRoutes);
app.use('/products', productsRoutes);

// Start webserver
app.listen(PORT);
console.log('Hamaca catalog microservice is now running on port: ' + PORT);
