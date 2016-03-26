var express = require('express');
var router = express.Router();

var Checkout = require('../models/checkout');
var DataStore = require('../models/dataStore');
var CatalogService = require('../models/catalogService');

/*
 * Add shipping route
 */
 router.post('/', function (req, res) {
    var dataStore = new DataStore();
    var checkoutId = parseInt(req.body['checkout-id']);
    var shippingData = req.body.shipping;
    if (typeof shippingData !== 'object' || shippingData.length < 1) {
        res.sendStatus(400);
    }
    else {
        var checkout = dataStore.loadCheckout(checkoutId, function (checkout) {
            checkout.setShipping(shippingData);
            checkout.save(dataStore, function () {
                res.sendStatus(200);
            });
        });
    }
});


module.exports = router;
