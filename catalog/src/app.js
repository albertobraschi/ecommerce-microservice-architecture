var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();

// Connect to Redis datastore
var redis = require("redis"),
    redisClient = redis.createClient({
        host: 'catalog-data.hamaca.io'
    });
redisClient.on("error", function (err) {
    console.log("Redis Error: " + err);
});
app.use(function (req, res, next) {
    req.redisClient = redisClient;
    next();
});

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
