var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var RedisManager = require('../models/redisManager');

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
    var redisManager = new RedisManager(req.redisClient);
    var product = new Product(productData);
    // process data
    if (product.validate()) {
        product.save(redisManager, function (productId) {
            res.status(201);
            res.json({id: productId});
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
    var redisManager = new RedisManager(req.redisClient);
    var productId = parseInt(req.params['id']);
    if (isNaN(productId)) {
        throw 'Invalid id';
    }
    var product = redisManager.loadProduct(productId, function (product) {
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
    var id = parseInt(req.params['id']);

    var redisManager = new RedisManager(req.redisClient);
    redisManager.loadProduct(id, function (product) {
        for (var i = 0; i < acceptedKeys.length; i++) {
            updatedValue = req.body[acceptedKeys[i]];
            if (typeof updatedValue !== 'undefined') {
                product.data[acceptedKeys[i]] = updatedValue;
            }
        }
        product.save(redisManager, function (productId) {
            res.sendStatus(204);
        })
    })
});

/*
 * List the products
 */
router.get('/', function (req, res) {
    var redisManager = new RedisManager(req.redisClient);
    redisManager.loadRange(1, 100, function (products) {
        res.status(200);
        var response = {
            page: 1,
            pages: 1,
            products: products
        };
        res.json(response);
    }, true);
});

module.exports = router;
