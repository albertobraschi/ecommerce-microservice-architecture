var util = require('util');

var Product = require('../models/product');

const KEY_SEPARATOR = ':';

const PRODUCT_PREFIX = 'product';
const NEXT_PRODUCT_ID = 'next_product_id';

var RedisManager = function (redisClient) {
    this.redisClient = redisClient;
};

RedisManager.prototype.saveProduct = function (product, done) {
    var redisClient = this.redisClient;
    if (typeof product.data.id !== 'undefined') {
        // update existing product
        var key = PRODUCT_PREFIX + KEY_SEPARATOR + product.data.id;
        redisClient.hmset(key,
            product.data, function (err, res) {
                if (err !== null) {
                    throw err;
                }
                done();
            });
    } else {
        // add new product
        var newId = NEXT_PRODUCT_ID;
        redisClient.incr(newId, function (err, reply) {
            var productId = reply;
            var key = PRODUCT_PREFIX + KEY_SEPARATOR + productId;
            redisClient.hmset(key,
                product.data, function (err, res) {
                    if (err !== null) {
                        throw err;
                    }
                    done(productId);
                });
        });
    }
};

RedisManager.prototype.loadProduct = function (id, done) {
    if (typeof id !== 'number') {
        throw "Invalid id or id not set";
    }
    var redisClient = this.redisClient;
    var key = PRODUCT_PREFIX + KEY_SEPARATOR + id;
    redisClient.hgetall(key, function (err, res) {
        var data = {};
        for (var key in res) {
            data[key] = res[key];
        }
        done(new Product(data));
    });
};

RedisManager.prototype.loadRange = function (startRange, endRange, done) {
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
        var key = PRODUCT_PREFIX + KEY_SEPARATOR + i;
        this.redisClient.hgetall(key, function (err, res) {
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

module.exports = RedisManager;
