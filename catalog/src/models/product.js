var Entity = require('./entity');
var util = require('util');

var mandatoryFields  = ['title', 'price', 'sku', 'description'];

var Product = function (data, redisClient) {
    Entity.apply(this, [data, redisClient]);
    this.type = 'product';
};

util.inherits(Product, Entity);

Product.prototype.validate = function () {
    for (var i = 0; i < mandatoryFields.length; i++) {
        if (typeof this.data[mandatoryFields[i]] === 'undefined') {
            return false;
        }
    }
    var isValid = typeof this.data.price === 'number';
    return isValid;
};

Product.loadRange = function (startRange, endRange, redisClient, done) {
    Entity.loadRange('product', startRange, endRange, redisClient, done);
};

module.exports = Product;
