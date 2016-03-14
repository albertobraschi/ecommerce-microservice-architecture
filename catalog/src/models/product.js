var util = require('util');

var mandatoryFields  = ['title', 'price', 'sku', 'description'];

const KEY_PREFIX = 'product';
const KEY_SEPARATOR = ':';
const NEXT_PRODUCT_ID = 'next_product_id';

var Product = function (data, redisClient) {
    this.data = data;
    this.redisClient = redisClient;
};

Product.prototype.data = {};

Product.prototype.save = function (callback) {
    var data = this.data;
    var redisClient = this.redisClient;
    if (typeof data.id !== 'undefined') {
        // update existing product
        var key = KEY_PREFIX + KEY_SEPARATOR + data.id;
        redisClient.hmset(key,
            data, function (err, res) {
                if (err !== null) {
                    throw err;
                }
                callback();
            });
    } else {
        // add new product
        var newId = NEXT_PRODUCT_ID;
        redisClient.incr(newId, function (err, reply) {
            var entityId = reply;
            var key = KEY_PREFIX + KEY_SEPARATOR + entityId;
            redisClient.hmset(key,
                data, function (err, res) {
                    if (err !== null) {
                        throw err;
                    }
                    callback(entityId);
                });
        });
    }
};

Product.prototype.load = function (callback) {
    var data = this.data;
    if (typeof data.id !== 'number') {
        throw "Invalid id or id not set";
    }
    var redisClient = this.redisClient;
    var key = KEY_PREFIX + KEY_SEPARATOR + this.data.id;
    redisClient.hgetall(key, function (err, res) {
        for (var key in res) {
            data[key] = res[key];
        }
        callback();
    });
};

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
        var key = KEY_PREFIX + KEY_SEPARATOR + i;
        redisClient.hgetall(key, function (err, res) {
            var productData = {};
            for (var dataKey in res) {
                productData[dataKey] = res[dataKey];
            }
            products.push(productData);
            if (products.length === endRange) {
                done(products);
            }
        });
        i++;
    } while (i <= endRange);
};

module.exports = Product;
