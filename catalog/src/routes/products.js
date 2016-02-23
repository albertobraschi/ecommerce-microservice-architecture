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
    title: req.param('title'),
    price: req.param('price'),
    description: req.param('description'),
  };
  // process data
  var redisClient = req.redisClient;

  var product = new Product(productData, redisClient);
  product.save(function () {
    res.sendStatus(201);
    // TODO get data from redis
    res.json(productData);
  });
});

module.exports = router;
