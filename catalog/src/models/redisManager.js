var Product = require('../models/product');

const KEY_SEPARATOR = ':';

const PRODUCT_PREFIX = 'product';
const NEXT_PRODUCT_ID_KEY = 'next_product_id';

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
        redisClient.incr(NEXT_PRODUCT_ID_KEY, function (err, reply) {
            var productId = reply;
            product.data.id = productId;
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
    var key = PRODUCT_PREFIX + KEY_SEPARATOR + id;
    this.redisClient.hgetall(key, function (err, res) {
        var data = {};
        for (var key in res) {
            data[key] = res[key];
        }
        done(new Product(data));
    });
};

RedisManager.prototype.loadRange = function (startRange, endRange, done, dataOnly) {
    if (typeof startRange !== 'number' ||
            typeof endRange !== 'number' ||
            startRange < 1 ||
            endRange < startRange) {
        throw 'Invalid entity range';
    }
    var i = startRange;
    var products = [];
    this.getNumberOfProducts(function (numberOfProducts) {
        if (numberOfProducts < endRange) {
            endRange = numberOfProducts;
        }
        do {
            var key = PRODUCT_PREFIX + KEY_SEPARATOR + i;
            this.redisClient.hgetall(key, function (err, res) {
                if (res !== null) {
                    var productData = {};
                    for (var dataKey in res) {
                        productData[dataKey] = res[dataKey];
                    }
                    var product;
                    if (dataOnly) {
                        product = productData;
                    } else {
                        product = new Product(productData);
                    }
                    products.push(product);
                }
                if (products.length >= endRange) {
                    done(products);
                }
            });
            i++;
        } while (i <= endRange);
    })
};

RedisManager.prototype.getNumberOfProducts = function (done) {
    this.redisClient.get(NEXT_PRODUCT_ID_KEY, function (err, res) {
        done(res);
    });
}

module.exports = RedisManager;
