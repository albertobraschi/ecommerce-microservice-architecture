var express = require('express');
var router = express.Router();

var Checkout = require('../models/checkout');
var DataStore = require('../models/dataStore');

/*
 * Start a new checkout process
 */
router.post('/', function (req, res) {
    res.sendStatus(404);
});

module.exports = router;
