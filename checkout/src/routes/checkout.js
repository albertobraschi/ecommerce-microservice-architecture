var express = require('express');
var router = express.Router();

var Checkout = require('../models/checkout');
var DataStore = require('../models/dataStore');
var CatalogService = require('../models/catalogService');

/*
 * Start a new checkout process
 */
router.post('/', function (req, res) {
    var cart = req.body.cart;
    if (typeof cart !== 'object' || cart.length < 1) {
        res.sendStatus(400);
    }
});

module.exports = router;
