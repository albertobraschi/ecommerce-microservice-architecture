var express = require('express');
var router = express.Router();

var DataStore = require('../models/dataStore');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Hamaca checkout service\n');
});

module.exports = router;
