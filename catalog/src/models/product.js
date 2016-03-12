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
    if (typeof startRange !== 'number' ||
            typeof endRange !== 'number' ||
            startRange < 1 ||
            endRange < startRange) {
        throw 'Invalid entity range';
    }
    var i = startRange;
    var products = [];
    // TODO don't try to load non existing products
    do {
        var key = 'product:' + i;
        redisClient.hgetall(key, function (err, res) {
            var productData = {};
            for (var dataKey in res) {
                productData[dataKey] = res[dataKey];
            }
            products.push(new Product(productData));
            if (products.length === endRange) {
                done(products);
            }
        });
        i++;
    } while (i <= endRange);
};

module.exports = Product;
