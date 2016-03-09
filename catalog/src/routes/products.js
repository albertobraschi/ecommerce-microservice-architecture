var express = require('express');
var router = express.Router();

var Product = require('../models/product');

/*
 * Add a new product
 */
router.post('/', function (req, res) {
    // get request parameters
    var productData = {
        title: req.body.title,
        price: req.body.price,
        sku: req.body.sku,
        description: req.body.description
    };
    var redisClient = req.redisClient;
    var product = new Product(productData, redisClient);
    // process data
    if (product.validate()) {
        product.save(function (entityId) {
            res.status(201);
            res.json({id: entityId});
        });
    }
    else {
        res.status(400);
        res.send('Error: Invalid product data');
    }
});

/*
 * Get a product
 */
router.get('/:id', function (req, res) {
    var redisClient = req.redisClient;
    var productId = parseInt(req.params['id']);
    if (isNaN(productId)) {
        throw 'Invalid id';
    }
    var product = new Product({id: productId}, redisClient);
    product.load(function () {
        res.status(200);
        res.json(product.data);
    });
});

/*
 * Update a product
 */
router.patch('/:id', function (req, res) {
    // get request parameters
    var acceptedKeys = ['title', 'price', 'sku', 'description'];
    var updatedData = {
        id: parseInt(req.params['id'])
    };
    for (var i = 0; i < acceptedKeys.length; i++) {
        updatedValue = req.body[acceptedKeys[i]];
        if (typeof updatedValue !== 'undefined') {
            updatedData[acceptedKeys[i]] = updatedValue;
        }
    }

    // process data
    var redisClient = req.redisClient;
    var product = new Product(updatedData, redisClient);
    product.save(function (entityId) {
        res.sendStatus(204);
    });
});

module.exports = router;
