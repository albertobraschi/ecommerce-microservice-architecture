var express = require('express');
var router = express.Router();

var Product = require('../models/product');

const NEXT_PRODUCT_ID;

/*
 * Add a new product
 */
router.post('/', function (req, res) {
    // get request parameters
    var productData = {
        title: req.params['title'],
        price: req.params['price'],
        description: req.params['description'],
    };
    // process data
    var redisClient = req.redisClient;
    var product = new Product(productData, redisClient);
    product.save(function (entityId) {
        res.status(201);
        res.json({id: entityId});
    });
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

module.exports = router;
