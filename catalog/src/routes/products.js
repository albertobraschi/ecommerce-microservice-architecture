var express = require('express');
var router = express.Router();

const NEXT_PRODUCT_ID;

/*
 * Add a new product
 */
router.post('/', function (req, res) {
  // get request parameters
  var title = req.param('title');
  var price = req.param('price');
  var description = req.param('description');
  // process data
  var redisClient = req.redisClient;
  redisClient.incr(NEXT_PRODUCT_ID, function (err, reply) {
    var productId = reply;
    redisClient.hmset("key",
      [
        "title", title,
        "price", price,
        "price", price,
        "description", description,
      ], function (err, res) {
      });
  });
});

module.exports = router;
