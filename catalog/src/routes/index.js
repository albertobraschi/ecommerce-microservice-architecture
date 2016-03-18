var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Hamaca catalog service\n');
});

module.exports = router;
