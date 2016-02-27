var Entity = require('./entity');
var util = require('util');

var Product = function (data, redisClient) {
  Entity.apply(this, [data, redisClient]);
  this.type = 'product';
};

util.inherits(Product, Entity);

module.exports = Product;