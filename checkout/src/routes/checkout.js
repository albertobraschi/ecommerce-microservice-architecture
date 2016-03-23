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
    else {
        var dataStore = new DataStore();
        var checkout = new Checkout(cart);
        checkout.save(dataStore, function (checkoutId) {
            res.status(201);
            res.json({id: checkoutId});
        });
    }
});

/*
 * Get an open checkout
 */
router.get('/:id', function (req, res) {
    var dataStore = new DataStore();
    var checkoutId = parseInt(req.params['id']);
    if (isNaN(checkoutId)) {
        throw 'Invalid id';
    }
    dataStore.loadCheckout(checkoutId, function (checkout) {
        res.status(200);
        res.json(checkout);
    }, true);
});

module.exports = router;
